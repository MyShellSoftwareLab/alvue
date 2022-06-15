export default {
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
            return {};
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
    },
    rules: {
        type: Object,
        default() {
            return {};
        }
    }
}
