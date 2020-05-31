const actionRPCProxyHandler = require("./actionRPCProxyHandler.js");
const requestProxy = require("../requestProxy.js");

/**
 * Proxy class for the main willCore instance.
 */
class actionRPCProxy extends requestProxy {
    constructor() {
        super();
    }
    /**
     * Factory method.
     * @type {InstanceType<requestProxyHandler>}
     */
    static new(actionRPCAssignable) {
        let result = new Proxy(new actionRPCProxy(), new actionRPCProxyHandler(actionRPCAssignable));
        return result;
    }
}

module.exports = actionRPCProxy;