const assignable = require("willcore.core/assignable/assignable");
const fileServerProxy = require("../proxies/fileServer/fileServerProxy.js");
const serverProxy = require("../proxies/server/serverProxy.js");
const fileHelper = require("../helpers/fileHelper.js");
const mimeTypes = require("../helpers/mimeTypes.json");
const file = require("path");

class fileServerAssignable extends assignable {
    constructor() {
        super({ string: 2 }, serverProxy);
        this.interceptors = {
            before: [],
            after: []
        };
        this.activationURL = null;
        this.fileURL = null;
    }

    completionResult() {
        this.activationURL = this.bindedValues.string[0];
        this.fileURL = this.bindedValues.string[1];

        let proxyResult = fileServerProxy.new(this);
        this.parentProxy._assignable.registerRequestProxy(this.activationURL, proxyResult);

        return proxyResult;
    }

    /**
    * @param {import('../models/requestDetails.js').requestInstance} requestInfo 
    */
    async onRequest(requestInfo, request, response) { //Model to be created here and action called
        let fileExtention = file.extname(this.fileURL);
        let mimeType = mimeTypes[fileExtention];
        if (!mimeType) {
            return { data: JSON.stringify({ error: "Invalid MIME type." }), mime: "application/json", status: 404 };
        }
        let filePath = this.parentProxy._assignable.pathHelper.getAbsolutePath(this.parentProxy._assignable.pathHelper.projectDir, this.fileURL);

        for (let beforeIndex = 0; beforeIndex < this.interceptors.before.length; beforeIndex++) {
            let interceptorResult = await this.interceptors.before[beforeIndex](filePath, request, response);
            if (interceptorResult) {
                return { data: interceptorResult, mime: model.mimeType, status: model.statusCode };
            }
        }

        if (filePath === false || !(await fileHelper.exists(filePath))) {
            return { data: JSON.stringify({ error: "File not found." }), mime: "application/json", status: 404 };
        }
        let data = await fileHelper.read(filePath);
        for (let afterIndex = 0; afterIndex < this.interceptors.after.length; afterIndex++) {
            let interceptorResult = await this.interceptors.after[afterIndex](data, request,response);
            if (!interceptorResult) {
                return { data: interceptorResult, mime:mimeType, status: model.statusCode };
            }
        }
        return { data:data, mime: mimeType, status: 200 };
    }

    completed() {
    }
}

module.exports = fileServerAssignable;