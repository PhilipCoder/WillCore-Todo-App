function loadHTML(url, view) {
    let promise = new Promise((resolve, reject) => {
        let headers = new Headers();
        headers.append('Content-Type', 'text/html');
        fetch(url, {
            mode: 'cors',
            method: 'get',
            headers: headers
        }).then(function (response) {
            response.text().then(function (text) {
                resolve(view ? new willCoreModules.idManager(view.viewManager).getProcessedIdHTML(text) : text);
            });
        })
    });
    return promise;
}

export { loadHTML };