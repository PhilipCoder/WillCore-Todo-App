const requestAssignable = require("./requestAssignable.js");
const actionRESTProxy = require("../proxies/request/actionREST/actionRESTProxy.js");
const actionModel = require("../proxies/request/actionModel/actionModelProxy.js");
const httpVerbs = require("../models/httpVerbs.js");

class actionRESTAssignable extends requestAssignable {
    constructor() {
        super({ function: 1, string: 2 });
        this.interceptors = {
            before: [],
            after: []
        };
    }

    completionResult() {
        let verbIndex = httpVerbs[this.bindedValues["string"][0].toUpperCase()] ? 0 : httpVerbs[this.bindedValues["string"][1].toUpperCase()] ? 1 : -1;
        if (verbIndex === -1) throw `Unsupported HTTP verb ${this.verb}.`;
        let parameterFormatIndex = verbIndex === 0 ? 1 : 0;
        this.verb = this.bindedValues["string"][verbIndex].toUpperCase();
        this.parameterFormat = this.bindedValues["string"][parameterFormatIndex].split("/");
        let proxyResult = actionRESTProxy.new(this);
        this.parentProxy._assignable.registerRequest(this.verb, this.propertyName, proxyResult);
        return proxyResult;
    }

    /**
    * @param {import('../models/requestDetails.js').requestInstance} requestInfo 
    */
    async onRequest(requestInfo, request,response) {
        requestInfo.parameterFormat = this.parameterFormat;
        let model = actionModel.new(requestInfo,this.parentProxy);
        model._request = request;
        model._response = response;
        model.record();
        for (let beforeIndex = 0; beforeIndex < this.interceptors.before.length; beforeIndex++) {
            let interceptorResult = await this.interceptors.before[beforeIndex](model, request,response);
            if (!interceptorResult) {
                return { data: JSON.stringify(model.stateValues), mime: "application/json", status: model.statusCode };
            }
        }

        await this.requestFunction(model);

        for (let afterIndex = 0; afterIndex < this.interceptors.after.length; afterIndex++) {
            let interceptorResult = await this.interceptors.after[afterIndex](model, request,response);
            if (!interceptorResult) {
                return { data: JSON.stringify(model.stateValues), mime: "application/json", status: model.statusCode };
            }
        }
        model.record(false);

        return { data: JSON.stringify(model.stateValues), mime: "application/json", status: 200 };
    }

    assignRestParameters(){
        
    }
}

module.exports = actionRESTAssignable;