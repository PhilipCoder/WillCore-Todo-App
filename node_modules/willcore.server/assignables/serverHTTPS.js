const assignable = require("willcore.core/assignable/assignable");
const https = require('https');
const requestDetails = require("../models/requestDetails.js").requestDetails;
const serverProxy = require("../proxies/server/serverProxy.js");
const fileHelper = require("../helpers/fileHelper.js");
const autoSelfSign = require("auto.self.sign");

class serverHTTPS extends assignable {
    constructor() {
        super({}, serverProxy);
    }

    static get noValues() {
        return serverProxy;
    }

    initServer(serverAssignableInstance) {
        return new Promise(async (resolve, reject) => {
            this.serverRequestEntry = async function (request, response) {
                let requestInfo = await requestDetails.fromRequest(request);
                let requestResult = await serverAssignableInstance.onRequest(requestInfo, request, response);
                if (!requestResult) {
                    response.writeHead("200");
                    response.end("Bad Request");
                } else if (!request.ended) {
                    response.writeHead(requestResult.status, { 'Content-Type': requestResult.mime });
                    response.end(requestResult.data);
                }
            }
            let config = autoSelfSign.config;
            config.certificateFolder = this.parentProxy._assignable.pathHelper.getAbsolutePath( this.parentProxy._assignable.pathHelper.projectDir, "/certificates");
            let certificates = await autoSelfSign.autoSelfSign(config);
            const options = {
                key: certificates.key,
                cert: certificates.cert
            };
            let server = https.createServer(options, this.serverRequestEntry).listen(serverAssignableInstance.serverInfo.port)
            resolve(server);
        });
    }

    completionResult() {
        this.parentProxy._assignable.server = this.initServer(this.parentProxy._assignable).then((server)=>{
            return this.parentProxy._assignable.server = server;
        });
        return this.parentProxy._assignable.server;
    }

    completed() {

    }
}

module.exports = serverHTTPS;