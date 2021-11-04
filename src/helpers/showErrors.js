const defaultOptions = {
    inputParentSelector: ".div",
    htmlErrors: false,
    errorClass: "",
    focusableErrors: true,
}

export default function showErrors(form, errors, options = defaultOptions) {
    let name_errors = Object.keys(errors);
    getInputFormsNames(form, options.inputParentSelector).forEach(name => {
        let selector = "[name='" + name + "']";
        let formGroup = form.querySelector(selector).closest(options.inputParentSelector);
        let current_error = formGroup.getElementsByClassName("alv-error");
        if (name_errors.includes(name)) {
            const errorText = typeof errors[name] == "object" ? errors[name][0] : errors[name];
            if (current_error.length > 0) {
                current_error[0][options.htmlErrors ? "innerHTML" : "textContent"] = errorText;
            } else {
                let span = getDefaultSpan();
                span[options.htmlErrors ? "innerHTML" : "textContent"] = errorText;
                formGroup.append(span);
                if (options.errorClass != "") {
                    formGroup.classList.add(options.errorClass);
                }
            }
        } else {
            if (current_error.length > 0) {
                current_error[0].remove();
            }
        }
    });
    removeErrorInputsEvents(options.errorClass, options.inputParentSelector);
    if (options.focusableErrors) {
        focusError(options.inputParentSelector);
    }
}

function getInputFormsNames(form, inputParentSelector) {
    let inputForms = form.querySelectorAll(inputParentSelector + " [name]")
    return [...inputForms].map(inputForm => inputForm.getAttribute("name"));
}

function removeErrorInputsEvents(errorClass, inputParentSelector) {
    document.querySelectorAll(`.${errorClass} [name]`).forEach(input => {
        input.addEventListener("change", () => {
            input.closest(inputParentSelector).classList.remove(errorClass);
            const alvError = input.closest(inputParentSelector).querySelector(".alv-error");
            if (alvError) alvError.remove();
        });
    });
}


function focusError(inputParentSelector) {
    let firstInputError = document.querySelector(".alv-error");
    if (firstInputError) {
        firstInputError = firstInputError.closest(inputParentSelector).querySelector("input,select,textarea");
        firstInputError && firstInputError.focus();
    }
}

function getDefaultSpan() {
    let span = document.createElement("span");
    span.classList.add("alv-error");
    span.style.fontSize = "70%";
    span.style.color = "crimson";
    return span;
}
