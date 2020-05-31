const availableMethods = require("./httpVerbs.js");
const url = require('url');

function getQueryParams(requestDetails, request) {
    const queryObject = url.parse(request.url, true).query;
    for (let key in queryObject) {
        requestDetails._parameters[key] = isNaN(queryObject[key]) ? queryObject[key] : Number(queryObject[key]);
    }
}

function getRequestBody(requestDetails, request) {
    return new Promise((resolve, reject) => {
        if (request.method === 'POST' || request.method === 'PUT') {
            let body = '';
            request.on('data', chunk => {
                body += chunk.toString();
            });
            request.on('end', () => {
                try {
                    requestDetails.body = JSON.parse(body);
                } catch (e) {
                    requestDetails.body = null;
                }
                resolve();
            });
        } else {
            resolve();
        }

    });
}

function assignHeaders(requestDetails, request) {
    for (let key in request.headers) {
        requestDetails._headers[key] = request.headers[key];
    }
}

class requestDetails {
    constructor() {
        this._initLocals();
    }

    static async fromRequest(request, parameterFormat) {
        let result = new requestDetails();
        if (request) {
            result.request = request;
            getQueryParams(result, request);
            await getRequestBody(result, request);
            result.url = request.url;
            result.method = request.method;
            assignHeaders(result, request);
            this.parameterFormat = parameterFormat;
        }
        return result;
    }

    //URL
    get url() {
        return this._url;
    }
    set url(value) {
        if (!value.startsWith("/")) throw "URL should start with a '/'.";
        this._url = value;
    }

    //method
    get method() {
        return this._method;
    }
    set method(value) {
        let method = availableMethods[value];
        if (!method) throw `Unsupported HTTP verb ${value}`;
        this._method = method;
    }

    //parameters
    get parameters() {
        return this._parameters;
    }
    set parameters(value) {
        this._parameters = value;
    }

    //headers
    get headers() {
        return this._headers;
    }
    set headers(value) {
        this._headers = value;
    }

    //body
    get body() {
        return this._body;
    }
    set body(value) {
        this._body = value;
    }

    //servicePart
    get servicePart() {
        let urlParts = this._url.split("/");
        if (urlParts.length < 2) throw `Invalid URL. URL does not contain a service part: ${this._url}.`
        return urlParts[1];
    }

    //action part
    get actionPart() {
        let urlParts = this._url.split("/");
        if (urlParts.length < 3) throw `Invalid URL. URL does not contain an action part: ${this._url}.`
        let result = urlParts[2];
        if (result.indexOf("?") > 0) {
            result = result.substring(0, result.indexOf("?"))
        }
        return result;
    }

    get restParameters(){
        let restParts = this.restParts;
        let result = {};
        if (this.parameterFormat){
            let parameterFormatParts = this.parameterFormat;
            let minimumCount = restParts.length < parameterFormatParts.length ? restParts.length : parameterFormatParts.length;
            for (let i = 0; i < minimumCount; i++){
                let parameterValue = restParts[i];
                parameterValue = !isNaN(parameterValue) ? Number(parameterValue) : parameterValue;
                result[parameterFormatParts[i]] = parameterValue;
            }
        }
        return result;
    }

    get restParts() {
        let urlPart = this._url.indexOf("?") > 0 ? this._url.substring(0, this._url.indexOf("?")) : this._url;
        let urlParts = urlPart.split("/");
        if (urlParts.length < 3) throw `Invalid URL. URL does not contain an action part: ${this._url}.`
        let result = [];
        for (let i = 3; i < urlParts.length; i++) {
            result.push(urlParts[i]);
        }
        return result;
    }

    get fileName() {
        let fileUrl = this._url.substring(1);
        fileUrl = fileUrl.substring(fileUrl.indexOf("/"));
        let parameterIndex = fileUrl.indexOf("?");
        if ( parameterIndex > -1)
        {
            fileUrl = fileUrl.substring(0,parameterIndex);
        }
        if (fileUrl.length === 0) fileUrl = "/";
        return fileUrl;
    }

    _initLocals() {
        /**@type {string} */
        this._url = null;
        /**@type {string} */
        this._method = null;
        /**@type {ArrayLike<Object>} */
        this._parameters = {};
        /**@type {ArrayLike<Object>} */
        this._headers = {};
        /**@type {Object} */
        this._body = null;
    }
}

exports.requestDetails = requestDetails;
