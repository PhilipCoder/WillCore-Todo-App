const assignable = require("willcore.core/assignable/assignable");
const http = require('http');
const requestDetails = require("../models/requestDetails.js").requestDetails;
const serverProxy = require("../proxies/server/serverProxy.js");

class serverHTTP extends assignable {
    constructor() {
        super({ }, serverProxy);
    }

    static get noValues(){
        return serverProxy;
    } 

    initServer(serverAssignableInstance){
        this.serverRequestEntry = async function (request, response) {
            let requestInfo = await requestDetails.fromRequest(request);
            let requestResult = await serverAssignableInstance.onRequest(requestInfo, request,response);
            if (!requestResult) {
                response.writeHead("200");
                response.end("Bad Request");
            } else if (!request.ended) {
                response.writeHead(requestResult.status, { 'Content-Type': requestResult.mime });
                response.end(requestResult.data);
            }
        }
        return http.createServer(this.serverRequestEntry).listen(serverAssignableInstance.serverInfo.port);
    }

    completionResult() {
        return false;
    }

    completed() {
        this.parentProxy._assignable.server = this.initServer(this.parentProxy._assignable);
    }
}

module.exports = serverHTTP;