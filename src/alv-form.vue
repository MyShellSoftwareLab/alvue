<template>
    <form v-bind:action="action" method="post" @submit.prevent="sendFormData" ref="form">
        <input type="hidden" name="_method" :value="method">
        <input type="hidden" name="csrf" ref="token">
        <slot></slot>
    </form>
</template>

<script>
    export default {
        name: "alv-form",
        props:{
            action: String,
            method: String,
            resetOnDone: Boolean,
            dataObject: Object,
            dataArray: Object,
            inputParentSelector: String
        },
        mounted(){
            this.$refs.token.value = document.querySelector('[name="csrf-token"]').getAttribute('content');
        },
        methods: {
            sendFormData(){
                let $this = this;
                let form = this.$refs.form;
                let formData;
                if(typeof this.dataObject !== "undefined")
                    formData  = this.getFormObject();
                else if(typeof this.dataArray !== "undefined")
                    formData  = this.getFormArray();
                else
                    formData  = this.getFormNames(form);

                axios.post(this.action, formData)
                    .then( response => {
                        $this.$emit('after-done', response);
                        if($this.resetOnDone)
                            form.reset();
                        $this.dropAllErrors();
                    }).catch( exception =>{
                    let errors = exception.response.data.errors;
                    $this.showErrors(form,errors);
                    $this.$emit('after-error');
                });
            },
            getFormNames(form){
                return new FormData(form);
            },
            getFormArray(){
                let form = this.dataArray;
                let formData = this.createFormData();
                formData[Object.keys(form)[0]] =  form[Object.keys(form)[0]];
                return formData;
            },
            getFormObject(){
                let form = this.dataObject;
                let formData = this.createFormData();
                for(let name in form){
                    formData[name] = form[name];
                }
                return formData;
            },
            createFormData(){
                let formData = {};
                formData._method = this.method;
                formData._token = this.token;
                return formData;
            },

            showErrors(form,errors){
                let $this = this;
                let name_errors = Object.keys(errors);
                this.getInputFormsNames().forEach(function (name) {
                    let selector = "[name='" + name + "']";
                    let formGroup = form.querySelector(selector).closest($this.parentSelector);
                    let current_error = formGroup.getElementsByClassName('alv-error');
                    if(name_errors.includes(name)) {
                        if(current_error.length > 0) {
                            current_error[0].textContent = errors[name][0];
                        }else{
                            let span = $this.getDefaultSpan();
                            span.textContent = errors[name][0];
                            formGroup.append(span)
                        }
                    }else{
                        if(current_error.length > 0)
                            current_error[0].remove();
                    }

                })
            },
            dropAllErrors(){
                let current_errors = document.getElementsByClassName('alv-error');
                while(current_errors[0]) {
                    current_errors[0].parentNode.removeChild(current_errors[0]);
                }
            },
            getDefaultSpan(){
                let span = document.createElement('span');
                span.classList.add('alv-error');
                span.style.fontSize = '70%';
                span.style.color = 'crimson';
                return span;
            },
            getInputFormsNames(){
                let inputForms = this.$refs.form.querySelectorAll(this.parentSelector+' > [name]')
                let names = []
                inputForms.forEach(function(inputForm) {
                    names.push(inputForm.getAttribute('name'));
                });
                return names
            }
        },
        computed:{
            parentSelector: function () {
                return (typeof this.inputParentSelector !== "undefined")?this.inputParentSelector:'.form-group';
            }
        }
    }
</script>

<style scoped>

</style>
