/*
Steps: 
1) Base service assignable registers itself on the server assignable.
2) When a request is coming through the server assignable, it calls the onRequest method on the base service assignable that is registered with the first request segment.
3) The inherited assignable will handle its own stuff in the onRequest method if overwritten
*/

const assignable = require("willcore.core/assignable/assignable");
const willCoreProxy = require("willcore.core");
const serverProxy = require("../proxies/server/serverProxy.js");
const serviceProxy = require("../proxies/service/serviceProxy.js");
const requestProxyBase = require("../proxies/request/requestProxy.js");
const requestDetails = require("../models/requestDetails.js").requestDetails;
const pathHelper = require("../helpers/path.js");

class serverAssignable extends assignable {
    constructor() {
        super({ number: 1, string: 1 }, willCoreProxy);
        this.serverInfo = {
            port: 3003,
            name: ""
        };
        this.server = null;
        this.requestProxies = {};
        this.globalInterceptors = [];
        this.directory = null;
        this.pathHelper = null;
    }

    /**
     * @param {requestDetails} requestInfo 
     */
    async onRequest(requestInfo, request, response) {
        let requestProxy = this.requestProxies[requestInfo.url] || this.requestProxies[requestInfo.servicePart];
        if (!requestProxy) {
            return { data: JSON.stringify({ error: "Endpoint not found" }), mime: "application/json", status: 404 };
        }
        this.globalInterceptors.forEach(async (interceptor) => {
            await interceptor(requestInfo, request, response);
        });
        let requestResult = await requestProxy._assignable.onRequest(requestInfo, request, response);
        return requestResult;
    }

    registerRequestProxy(activationSegment, requestProxy) {
        if (!(requestProxy instanceof serviceProxy || requestProxy instanceof requestProxyBase)) throw "Only service proxies can be registered on a server.";
        this.requestProxies[activationSegment] = requestProxy;
    }

    completionResult() {
        let proxyResult = serverProxy.new(this);
        return proxyResult;
    }

    completed() {
        this.serverInfo.name = this.propertyName;
        this.serverInfo.port = this.bindedValues.number[0];
        this.directory = this.bindedValues.string[0];
        this.pathHelper = new pathHelper(this.directory);
    }
}

module.exports = serverAssignable;