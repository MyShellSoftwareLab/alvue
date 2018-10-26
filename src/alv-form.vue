<template>
    <form v-bind:action="action" method="post" @submit.prevent="submit" ref="form">
        <input type="hidden" name="_method" v-bind:value="method">
        <input type="hidden" name="csrf" v-bind:value="token">
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
            dataArray: Array
        },
        data : () => {
            return {
                token: document.querySelector('[name="csrf-token"]').getAttribute('content')
            }
        },
        methods: {
            submit(){
                let current_errors = document.getElementsByClassName('alv_error');
                while(current_errors[0]) {
                    current_errors[0].parentNode.removeChild(current_errors[0]);
                }
                this.sendFormData();
            },
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
                        $this.$emit('afterDone', response)
                        if($this.resetOnDone)
                            form.reset();
                    }).catch( exception =>{
                    let errors = exception.response.data.errors;
                    $this.showErrors(form,errors)
                    $this.$emit('afterError')
                });
            },
            getFormNames(form){
                return new FormData(form);
            },
            getFormArray(){
                let form = this.dataArray;
                console.log(this.dataArray);
                let formData = this.createFormdata();
                formData[Object.keys(form)[0]] =  form[Object.keys(form)[0]];
                return formData;
            },
            getFormObject(){
                let form = this.data;
                let formData = this.createFormdata();
                for(let name in form){
                    formData[name] = form[name];
                }
                return formData;
            },
            createFormdata(){
                let formData = {};
                formData._method = this.method;
                formData._token = this.token;
                return formData;
            },

            showErrors(form,errors){
                Object.keys(errors).forEach(function(name){
                    var selector = "[name='" + name + "']";
                    var span ='<span style="font-size: 70%; color: crimson" class="alv_error">'+ errors[name]+ ' </span>';
                    form.querySelector(selector).closest('.form-group').innerHTML += span
                });
            }
        }
    }
</script>

<style scoped>

</style>
