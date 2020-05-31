const assignable = require("willcore.core/assignable/assignable");
const requestProxy = require("../proxies/request/requestProxy.js");

class requestInterceptorAssignable extends assignable {
    constructor() {
        super({ },requestProxy);
    }

    completionResult() {
        let methodName = this.propertyName;
        let verb = this.parentProxy._assignable.verb;
        let originalMethodName = this.parentProxy._assignable.propertyName;
        if (this.parentProxy._assignable.parentProxy._assignable.requests[verb] && this.parentProxy._assignable.parentProxy._assignable.requests[verb][originalMethodName]){
            if (!this.parentProxy._assignable.parentProxy._assignable.requests[verb][methodName]){
                this.parentProxy._assignable.parentProxy._assignable.requests[verb][methodName] = this.parentProxy._assignable.parentProxy._assignable.requests[verb][originalMethodName];
                delete this.parentProxy._assignable.parentProxy._assignable.requests[verb][originalMethodName];
            }else{
                throw `An action named ${methodName} for verb ${verb} already exists.`;
            }
        }else{
            throw `No registered action named ${originalMethodName} exists for verb ${verb}.`;
        }
        return false;
    }
    
    completed() {
    }
}

module.exports = requestInterceptorAssignable;