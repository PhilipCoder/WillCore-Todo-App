const serverProxyHandler = require("./serverProxyHandler.js");
const baseProxy = require("willcore.core/proxies/base/baseProxy.js");

/**
 * Proxy class for the main willCore instance.
 */
class serverProxy extends baseProxy {
    constructor() {
        super();
    }
    /**
     * Factory method.
     * @type {InstanceType<serverProxyHandler>}
     */
    static new(serverAssignable) {
        let result = new Proxy(new serverProxy(), new serverProxyHandler(serverAssignable));
        return result;
    }
}

module.exports = serverProxy;