const assignable = require("willcore.core/assignable/assignable");
const filesServerProxy = require("../proxies/filesServer/filesServerProxy.js");
const serverProxy = require("../proxies/server/serverProxy.js");
const fileHelper = require("../helpers/fileHelper.js");
const mimeTypes = require("../helpers/mimeTypes.json");
const file = require("path");

class filesServerAssignable extends assignable {
    constructor() {
        super({ string: 1 }, serverProxy);
        this.interceptors = {
            before: [],
            after: []
        };
    }

    completionResult() {
        let proxyResult = filesServerProxy.new(this);
        this.parentProxy._assignable.registerRequestProxy(this.propertyName, proxyResult);

        return proxyResult;
    }

    /**
    * @param {import('../models/requestDetails.js').requestInstance} requestInfo 
    */
    async onRequest(requestInfo, request, response) { //Model to be created here and action called
        let fileExtention = file.extname(requestInfo.fileName);
        let mimeType = mimeTypes[fileExtention];
        if (!mimeType) {
            return { data: JSON.stringify({ error: "Invalid MIME type." }), mime: "application/json", status: 404 };
        }
        let assignablePath = this.bindedValues.string[0];
        let filePath = this.parentProxy._assignable.pathHelper.getFilePath(assignablePath, requestInfo.fileName);

        for (let beforeIndex = 0; beforeIndex < this.interceptors.before.length; beforeIndex++) {
            let interceptorResult = await this.interceptors.before[beforeIndex](filePath, request, response);
            if (interceptorResult) {
                return { data: interceptorResult, mime: response.mimeType, status: response.statusCode };
            }
        }

        if (filePath === false || filePath.indexOf("_server") > -1 || !(await fileHelper.exists(filePath))) {
            return { data: JSON.stringify({ error: "File not found." }), mime: "application/json", status: 404 };
        }
        let data = await fileHelper.read(filePath);
        for (let afterIndex = 0; afterIndex < this.interceptors.after.length; afterIndex++) {
            let interceptorResult = await this.interceptors.after[afterIndex](data, request,response);
            if (!interceptorResult) {
                return { data: interceptorResult, mime:mimeType, status: response.statusCode };
            }
        }
        return { data:data, mime: mimeType, status: 200 };
    }

    completed() {
    }
}

module.exports = filesServerAssignable;