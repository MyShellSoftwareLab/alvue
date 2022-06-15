<template>
    <form v-bind:action="action" :method="method" @submit.prevent="sendFormData" ref="form">
        <input type="hidden" name="_method" :value="method">
        <slot></slot>
    </form>
</template>

<script>
import LoadingSpinner from "./lading-spinner.vue";
import {responseToJSON, createFormData, showErrors, isUrl, validateRules} from "../helpers";
import {createApp} from "vue";
import props from "../options/props"

export default {
    name: "alv-form",
    props,
    methods: {
        sendFormData() {
            this.$emit('before-submit');
            this.globalEmit('before-submit')
            this.setButtonLoading();
            if (isUrl(this.action)) {
                let formData;
                if (typeof this.dataObject !== "undefined") {
                    const rulesErrors = validateRules(this.rules, this.dataObject);
                    if (Object.keys(rulesErrors).length > 0) {
                        return this.afterError({response: {data: {errors: rulesErrors}}});
                    }
                    formData = createFormData(this.dataObject, this.method);
                } else
                    formData = new FormData(this.$refs.form);

                const axiosOptions = {
                    method: this.method.toLowerCase() === "get" ? "GET" : "POST",
                    url: this.action,
                    ...this.axiosConfig
                }
                axiosOptions[this.method.toLowerCase() === "get" ? "params" : "data"] = formData;

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
                this.$emit("after-error", response.data);
                this.globalEmit('after-error', response)
                responseToJSON(response.data).then(response => {
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
                    const loadingApp = createApp(LoadingSpinner);
                    const loading = document.createElement("span")
                    loading.style.marginLeft = '15px'
                    loading.id = 'alv-loading-spinner'
                    loadingApp.mount(loading);
                    button.appendChild(loading);
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
