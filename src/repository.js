export default {
    responseToJSON(response) {
        return new Promise(function (resolve) {
            if (response instanceof Blob) {
                const reader = new FileReader();
                reader.addEventListener("loadend", (e) => {
                    const text = e.srcElement.result;
                    resolve(JSON.parse(text));
                });
                reader.readAsText(response);
            } else {
                resolve(response)
            }
        });
    }
}
