const assignable = require("willcore.core/assignable/assignable");
const serverProxy = require("../proxies/server/serverProxy.js");
const serviceProxy = require("../proxies/service/serviceProxy.js");

class executableServiceAssignable extends assignable {
    constructor() {
        super({ string: 1, function: 1 }, serverProxy);
        this.activationSegment = null;
        this.executeJob = null;
    }

    completionResult() {
        let proxyResult = serviceProxy.new(this);
        this.parentProxy._assignable.registerRequestProxy(this.activationSegment, proxyResult);
        return proxyResult;
    }

    /**
    * @param {import('../models/requestDetails.js').requestInstance} requestInfo 
    */
    async onRequest(requestInfo, request, response) {
        return await this.executeJob(requestInfo, request, response);
    }

    completed() {
        this.activationSegment = this.bindedValues.string[0];
        this.executeJob = this.bindedValues.function[0];
    }
}

module.exports = executableServiceAssignable;