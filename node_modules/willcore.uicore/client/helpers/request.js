
class request {
    static postRequest(url, method, parameterObj, headers) {
        headers['Content-Type'] = 'application/json';
        let body = null;
        let query = null;
        for (let key in parameterObj) {
            if (typeof parameterObj[key] === "object") {
                body = body || {};
                body = parameterObj[key];
            } else {
                query = query || {};
                query[key] = parameterObj[key];
            }
        }
        if (query) {
            url = new URL(url);
            url.search = new URLSearchParams(query);
        }
        return fetch(url, {
            method: method,
            mode: 'cors',
            body: JSON.stringify(body),
            headers: new Headers(headers)
        });
    }

    static async getRequest(url, method, parameters, headers) {
        url = window.location.protocol + "//" + window.location.host + url;
        method = method || "GET";
        parameters = parameters || {};
        headers = headers || {};
        headers['Content-Type'] = 'application/json';
        url = new URL(url);
        url.search = new URLSearchParams(parameters)
        let request = await fetch(url, {
            method: method,
            mode: 'cors',
            headers: new Headers(headers)
        });
        return await request.json();
    }
}

export { request };