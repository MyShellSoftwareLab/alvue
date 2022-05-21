import AlvForm from './components/alv-form.vue'

export default {
    install(Vue, options) {
        const AlvFormComponent = AlvForm;
        AlvFormComponent.computed = Object.assign({options: () => typeof options != "undefined" ? options : {}}, AlvFormComponent.computed)
        Vue.component("alv-form", AlvFormComponent);
    }
};
