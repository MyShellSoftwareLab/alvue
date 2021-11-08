<template>
    <form v-bind:action="action" :method="method" @submit.prevent="sendFormData" ref="form">
        <input type="hidden" name="_method" :value="method">
        <slot></slot>
    </form>
</template>

<script>
import LoadingSpinner from "./lading-spinner"
import {responseToJSON, createFormData, showErrors} from "../helpers";

export default {
    name: "alv-form",
    props: {
        action: [String, Function],
        method: {
            type: String,
            default: "post"
        },
        resetOnDone: Boolean,
        dataObject: Object,
        dataArray: Object,
        inputParentSelector: {
            type: String,
            default: "div"
        },
        spinner: {
            type: Boolean,
            default: false
        },
        errorClass: {
            type: String,
            default: null
        },
        axiosConfig: {
            type: Object,
            default() {
                return {}
            }
        },
        htmlErrors: {
            type: Boolean,
            default: false
        },
        focusableErrors: {
            type: Boolean,
            default: true
        }
    },
    methods: {
        sendFormData() {
            this.$emit('before-submit');
            this.globalEmit('before-submit')
            this.setButtonLoading();
            if (typeof this.action === "string") {
                let formData;
                if (typeof this.dataObject !== "undefined")
                    formData = createFormData(this.dataObject, this.method);
                else
                    formData = new FormData(this.$refs.form);

                const axiosOptions = {
                    method: this.method.toLowerCase() === "get" ? "GET" : "POST",
                    url: this.action,
                    ...this.axiosConfig
                }
                axiosOptions[this.method.toLowerCase() === "get" ? "params" : "data"] = formData;

                window.axios(axiosOptions).then(this.afterDone).catch(exception => this.afterError(exception.response));
            } else {
                this.action(this.dataObject).then(this.afterDone).catch(errors => this.afterError({data: {errors}}));
            }
        },
        afterDone(response) {
            this.$emit("after-done", response);
            this.globalEmit('after-done', response)
            if (this.resetOnDone)
                this.$refs.form.reset();
            this.dropAllErrors();
        },
        afterError(response) {
            this.$emit("after-error", response.data);
            this.globalEmit('after-error', response)
            console.log(response)
            responseToJSON(response.data).then(response => {
                this.unsetButtonLoading();
                let errors = response.errors;
                if (typeof errors == "object") {
                    showErrors(this.$refs.form, errors, {
                        inputParentSelector: this.inputParentSelector,
                        htmlErrors: this.htmlErrors,
                        errorClass: this.errorClass,
                        focusableErrors: this.focusableErrors
                    });
                }
            });
        },
        dropAllErrors() {
            let current_errors = document.getElementsByClassName("alv-error");
            while (current_errors[0]) {
                current_errors[0].parentNode.removeChild(current_errors[0]);
            }
        },
        setButtonLoading() {
            let button = this.submitButton;
            if (button != null) {
                if (this.spinner) {
                    const loading = new (this.constructor.extend(LoadingSpinner))();
                    loading.$mount();
                    button.appendChild(loading.$el);
                }
                button.disabled = true;
            }
        },
        unsetButtonLoading() {
            let button = this.submitButton;
            if (button != null) {
                if (this.spinner) {
                    button.lastChild.remove();
                }
                button.disabled = false;
            }
        },
        globalEmit(event, payload) {
            if (typeof this.options != "undefined" && typeof this.options[event] != "undefined")
                this.options['after-error'](payload);
        }
    },
    computed: {
        id() {
            return this.$refs.form.id;
        },
        submitButton() {
            const button = this.$refs.form.querySelector("[type='submit']");
            return button != null ? button : document.querySelector(`button[form="${this.id}"]`);
        }
    },
}
</script>
