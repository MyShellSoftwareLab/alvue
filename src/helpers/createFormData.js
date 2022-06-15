
export default function createFormData(dataObject, method) {
    let formData = new FormData();
    formData.append("_method", method);
    Object.keys(dataObject).forEach(key => {
        formData = append(formData, dataObject, "", key)
    });
    return formData;
}


function append(formData, form, name, key) {
    if (form[key] instanceof Date) {
        formData.append(name ? name : key, form[key].toLocaleString("sv"));
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
                formData = append(formData, form[key], name ? `${name}[${index}]` : `${key}[${index}]`, index)
            });
            return formData
        } else {
            Object.keys(form[key]).forEach(index => {
                let cleanIndex = index.slice(-2) === "[]" ? index.substring(0, index.length - 2) : index;
                formData = append(formData, form[key], name ? `${name}[${cleanIndex}]` : `${key}[${cleanIndex}]`, index)
            });
            return formData;
        }
    } else {
        if (form[key] != null)
            formData.append(name ? name : key, form[key]);
        return formData;
    }
}
