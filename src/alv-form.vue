<template>
    <form v-bind:action="action" :method="method" @submit.prevent="sendFormData" ref="form">
        <input type="hidden" name="_method" :value="method">
        <slot></slot>

    </form>
</template>

<script>
    import LoadingSpinner from "./lading-spinner"
    import Repository from "./repository";

    export default {
        name: "alv-form",
        props: {
            action: String,
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
                let form = this.$refs.form;
                let formData;
                if (typeof this.dataObject !== "undefined")
                    formData = this.getFormObject();
                else if (typeof this.dataArray !== "undefined")
                    formData = this.getFormArray();
                else
                    formData = this.getFormNames(form);
                this.setButtonLoading();

                window.axios({
                    method: this.method.toLowerCase() == "get" ? "GET" : "POST",
                    url: this.action,
                    data: formData,
                    ...this.axiosConfig
                }).then(response => {
                    this.$emit("after-done", response);
                    if (this.resetOnDone)
                        form.reset();
                    this.dropAllErrors();
                }).catch(exception => {
                    this.$emit("after-error", exception.response.data);
                    Repository.responseToJSON(exception.response.data).then(response => {
                        this.unsetButtonLoading();
                        let errors = response.errors;
                        if (typeof errors == "object") {
                            this.showErrors(form, errors);
                            if (this.focusableErrors) {
                                this.focusError();
                            }
                        }
                    });
                });
            },
            getFormNames(form) {
                return new FormData(form);
            },
            getFormArray() {
                let form = this.dataArray;
                let formData = this.createFormData();
                formData.append([Object.keys(form)[0]], form[Object.keys(form)[0]]);
                return formData;
            },
            getFormObject() {
                let form = this.dataObject;
                var formData = this.createFormData();
                Object.keys(form).forEach(key => {
                    formData = this.append(formData, form, "", key)
                });
                return formData;
            },
            append(formData, form, name, key) {
                if (form[key] instanceof Date) {
                    formData.append(name ? name : key, form[key].toISOString());
                    return formData;
                } else if (form[key] instanceof FileList) {
                    if (key.slice(-2) !== "[]") {
                        formData.append(name ? name : key, form[key][0]);
                        return formData;
                    } else {
                        for (let i = 0; i < form[key].length; i++)
                            formData.append(name ? `${name}[]` : key, form[key][i]);
                        return formData;
                    }
                } else if (form[key] instanceof File) {
                    formData.append(name ? name : key, form[key]);
                    return formData;
                } else if (form[key] && typeof form[key] == "object") {
                    if (Array.isArray(form[key])) {
                        form[key].forEach((item, index) => {
                            formData = this.append(formData, form[key], name ? `${name}[${index}]` : `${key}[${index}]`, index)
                        });
                        return formData
                    } else {
                        Object.keys(form[key]).forEach(index => {
                            let cleanIndex = index.slice(-2) === "[]" ? index.substring(0, index.length - 2) : index;
                            formData = this.append(formData, form[key], name ? `${name}[${cleanIndex}]` : `${key}[${cleanIndex}]`, index)
                        });
                        return formData;
                    }
                } else {
                    if (form[key] != null)
                        formData.append(name ? name : key, form[key]);
                    return formData;
                }
            },
            createFormData() {
                let formData = new FormData();
                formData.append("_method", this.method);
                return formData;
            },
            removeErrorInputsEvents() {
                document.querySelectorAll(`.${this.errorClass} [name]`).forEach(input => {
                        input.addEventListener("change", () => {
                            input.closest(this.inputParentSelector).classList.remove(this.errorClass);
                            input.closest(this.inputParentSelector).querySelector(".alv-error").remove();
                        });
                    }
                )
            },
            showErrors(form, errors) {
                let name_errors = Object.keys(errors);
                this.getInputFormsNames(form).forEach(name => {
                    let selector = "[name='" + name + "']";
                    let formGroup = form.querySelector(selector).closest(this.inputParentSelector);
                    let current_error = formGroup.getElementsByClassName("alv-error");
                    if (name_errors.includes(name)) {
                        if (current_error.length > 0) {
                            current_error[0][this.htmlErrors ? "innerHTML" : "textContent"] = errors[name][0];
                        } else {
                            let span = this.getDefaultSpan();
                            span[this.htmlErrors ? "innerHTML" : "textContent"] = errors[name][0];
                            formGroup.append(span);
                            if (this.errorClass != null) {
                                formGroup.classList.add(this.errorClass);
                            }
                        }
                    } else {
                        if (current_error.length > 0) {
                            current_error[0].remove();
                        }
                    }
                });
                this.removeErrorInputsEvents();
            },
            dropAllErrors() {
                let current_errors = document.getElementsByClassName("alv-error");
                while (current_errors[0]) {
                    current_errors[0].parentNode.removeChild(current_errors[0]);
                }
            },
            getDefaultSpan() {
                let span = document.createElement("span");
                span.classList.add("alv-error");
                span.style.fontSize = "70%";
                span.style.color = "crimson";
                return span;
            },
            getInputFormsNames(form) {
                let inputForms = form.querySelectorAll(this.inputParentSelector + " [name]")
                let names = []
                inputForms.forEach(function (inputForm) {
                    names.push(inputForm.getAttribute("name"));
                });
                return names;
            },
            setButtonLoading() {
                let button = this.submitButton;
                if (button != null) {
                    if (this.spinner) {
                        const loading = new (window.Vue.extend(LoadingSpinner))();
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
            focusError() {
                let firstInputError = document.querySelector(".alv-error");
                if (firstInputError) {
                    firstInputError = firstInputError.closest(this.inputParentSelector).querySelector("input,select,textarea");
                    firstInputError && firstInputError.focus();
                }
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

<style scoped>

</style>
