const assignable = require("./assignable.js");
const baseProxy = require("../proxies/base/baseProxy.js");
const defaultProxy = require("../proxies/default/defaultProxy.js");
class defaultAssignable extends assignable {
    constructor() {
        super({}, baseProxy); 
    }

    static get noValues(){
        return baseProxy;
    }

    completionResult() {
        let proxyResult = defaultProxy.new(this, this.propertyName,this);
        return proxyResult;
    }

    completed() {
    }
}

module.exports = defaultAssignable;