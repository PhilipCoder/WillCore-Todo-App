const globalHeaders = {};
const globalParameters = {};

function PostRequest(url, method, parameterObj, headers) {
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
    })
};

function GetRequest(url, method, parameters, headers) {
    headers['Content-Type'] = 'application/json';
    url = new URL(url);
    url.search = new URLSearchParams(parameters)
    return fetch(url, {
        method: method,
        mode: 'cors',
        headers: new Headers(headers)
    });
};

const requestFunction = function (serviceName, actionName, httpVerb) {
    return (parameters, headers) => {
        headers = headers || {};
        parameters = parameters || {};
        let url = `${window.location.origin}/${serviceName}/${actionName}`;
        for (let headerKey in globalHeaders) {
            headers[headerKey] = globalHeaders[headerKey];
        }
        for (let parameterKey in globalParameters) {
            parameters[parameterKey] = globalParameters[parameterKey];
        }
        return new Promise((resolve, reject) => {
            var promiseCall = httpVerb == "POST" || httpVerb == "PUT" || httpVerb == "PATCH" ?
                PostRequest(url, httpVerb, parameters, headers) :
                GetRequest(url, httpVerb, parameters, headers);

                promiseCall.then(async response => {
                    response = await response.json();
                    resolve(response);
                }).catch(error => {
                    reject(error);
                });
        });
    };
};

export { requestFunction, globalHeaders, globalParameters };