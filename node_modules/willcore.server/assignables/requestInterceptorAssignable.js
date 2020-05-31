const assignable = require("willcore.core/assignable/assignable");
const requestInterceptorProxy = require("../proxies/request/requestInterceptor/requestInterceptorProxy.js");
const requestAssignable = require("../proxies/request/requestProxy.js");
class requestInterceptorAssignable extends assignable {
    constructor() {
        super({ function: 1 },requestAssignable);
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
        this.position = this.propertyName.toLowerCase();
        if (!this.interceptors[this.position]) throw `Unsupported interceptor: ${this.position}. Should be either 'before' or 'after'`;
        let proxyResult = requestInterceptorProxy.new(this);
        this.interceptors[this.position](proxyResult);
        return proxyResult;
    }
    
    completed() {
    }
}

module.exports = requestInterceptorAssignable;