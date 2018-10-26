import ALVComponent from './alv-form';

const alv = {
    install(Vue, options) {
        Vue.component('alv-form', ALVComponent);
        Vue.mixin({
            mounted() {
                console.log('ALV is running!!!!');
            }
        });
    }
};

export default  alv;