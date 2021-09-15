import AlvForm from './alv-form';

export default {
    install(Vue, options) {
        const AlvFormComponent = AlvForm;
        AlvFormComponent.computed = Object.assign({options: () => options}, AlvFormComponent.computed)
        Vue.component("alv-form", AlvFormComponent);
    }
};
