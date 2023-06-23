<template>
    <form v-bind:action="action" :method="method" @submit.prevent="sendFormData" ref="form">
        <input type="hidden" name="_method" :value="method">
        <slot></slot>
    </form>
</template>

<script>
import LoadingSpinner from "./lading-spinner.vue";
import {responseToJSON, createFormData, showErrors, isUrl} from "../helpers";

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
        },
        enableButtonOnDone: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        showErrors(form, errors){
            showErrors(form, errors, {
                inputParentSelector: this.inputParentSelector,
                htmlErrors: this.htmlErrors,
                errorClass: this.errorClass,
                focusableErrors: this.focusableErrors
            });
        },
        sendFormData() {
            this.$emit('before-submit');
            this.globalEmit('before-submit')
            this.setButtonLoading();
            if (isUrl(this.action)) {
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
                if(this.method.toLowerCase() === "get")
                    axiosOptions.params = this.dataObject;
                else
                    axiosOptions.data = formData;


                window.axios(axiosOptions).then(this.afterDone).catch(this.afterError);
            } else {
                this.action(this.dataObject).then(this.afterDone).catch(errors => this.afterError({response: {data: {errors}}}));
            }
        },
        afterDone(response) {
            this.$emit("after-done", response);
            this.globalEmit('after-done', response)

            if (this.resetOnDone)
                this.$refs.form.reset();

            if (this.enableButtonOnDone)
                this.unsetButtonLoading();

            this.dropAllErrors();
        },
        afterError(exception) {
            this.unsetButtonLoading();
            if (typeof exception.response != 'undefined') {
                const response = exception.response;
                responseToJSON(response.data).then(response => {
                    this.$emit("after-error", response.data);
                    this.globalEmit('after-error', response);
                    let errors = response.errors;
                    if (typeof errors == "object") {
                        this.showErrors(this.$refs.form, errors);
                    }
                });
            } else {
                console.error(exception);
            }
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
                    loading.$el.id = 'alv-loading-spinner';
                    button.appendChild(loading.$el);
                }
                button.disabled = true;
            }
        },
        unsetButtonLoading() {
            let button = this.submitButton;
            if (button != null) {
                let loadingSpinner = button.querySelector('#alv-loading-spinner');
                if (this.spinner && loadingSpinner) {
                    loadingSpinner.remove();
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
