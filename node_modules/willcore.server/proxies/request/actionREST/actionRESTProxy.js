const actionRESTProxyHandler = require("./actionRESTProxyHandler.js");
const requestProxy = require("../requestProxy.js");

/**
 * Proxy class for the main willCore instance.
 */
class actionRESTProxy extends requestProxy {
    constructor() {
        super();
    }
    /**
     * Factory method.
     * @type {InstanceType<requestProxyHandler>}
     */
    static new(actionRESTAssignable) {
        let result = new Proxy(new actionRESTProxy(), new actionRESTProxyHandler(actionRESTAssignable));
        return result;
    }
}

module.exports = actionRESTProxy;