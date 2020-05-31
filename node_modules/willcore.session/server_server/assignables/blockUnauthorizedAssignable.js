const assignable = require("willcore.core/assignable/assignable");
const requestInterceptorProxy = require("willcore.server/proxies/request/requestInterceptor/requestInterceptorProxy.js");
const requestAssignable = require("willcore.server/proxies/request/requestProxy.js");
class blockUnauthorizedAssignable extends assignable {
    constructor() {
        super({},requestAssignable);
        this.interceptors = {
            before: (proxy)=>{
                this.parentProxy._assignable.interceptors.before.push(this.bindedValues.function[0]);
            },
            after: (proxy)=>{
                this.parentProxy._assignable.interceptors.after.push(this.bindedValues.function[0]);
            }
        };
    }

    completionResult() {
        this.bindedValues.function = [];
        this.bindedValues.function.push( async (model,request,response) => {
            if (this.parentProxy._assignable.parentProxy._assignable.parentProxy._assignable.sessionLogic.isAuthenticated(request,response)) return true;
            model.statusCode = 501;
            model.error = "Unauthorized";
            return false;
        });
        this.position = this.propertyName.toLowerCase();
        if (!this.interceptors[this.position]) throw `Unsupported interceptor: ${this.position}. Should be either 'before' or 'after'`;
        let proxyResult = requestInterceptorProxy.new(this);
        this.interceptors[this.position](proxyResult);
        return proxyResult;
    }
    
    completed() {
    }
}

module.exports = blockUnauthorizedAssignable;