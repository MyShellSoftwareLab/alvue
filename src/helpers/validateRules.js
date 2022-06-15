export default function (rules, target) {
    var errors = {};
    Object.keys(rules).forEach((field) => {
        rules[field].split('|').forEach((rule) => {
            switch (rule) {
                case 'required':
                    if (target[field] === '' || typeof target[field] == 'undefined' || target[field] === null) {
                        errors[field] = ['Este campo es requerido'];
                    }
                    break;
            }
        });
    });

    return errors;
}
