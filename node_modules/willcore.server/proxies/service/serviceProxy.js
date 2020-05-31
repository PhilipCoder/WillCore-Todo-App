const serviceProxyHandler = require("./serviceProxyHandler.js");
const baseProxy = require("willcore.core/proxies/base/baseProxy.js");

/**
 * Proxy class for the main willCore instance.
 */
class serviceProxy extends baseProxy {
    constructor() {
        super();
    }
    /**
     * Factory method.
     * @type {InstanceType<serverProxyHandler>}
     */
    static new(serviceAssignable) {
        let result = new Proxy(new serviceProxy(), new serviceProxyHandler(serviceAssignable));
        return result;
    }
}

module.exports = serviceProxy;