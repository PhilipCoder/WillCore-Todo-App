const requestInterceptorProxyHandler = require("./requestInterceptorProxyHandler.js");
const baseProxy = require("willcore.core/proxies/base/baseProxy.js");

/**
 * Proxy class for the main willCore instance.
 */
class requestInterceptorProxy extends baseProxy {
    constructor() {
        super();
    }
    /**
     * Factory method.
     * @type {InstanceType<requestProxyHandler>}
     */
    static new(actionRPCAssignable) {
        let result = new Proxy(new requestInterceptorProxy(), new requestInterceptorProxyHandler(actionRPCAssignable));
        return result;
    }
}

module.exports = requestInterceptorProxy;