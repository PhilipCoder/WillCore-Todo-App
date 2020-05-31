const modelAuthProxyHandler = require("./modelAuthProxyHandler.js");
const baseProxy = require("willcore.core/proxies/base/baseProxy.js");

/**
 * Proxy class for the main willCore instance.
 */
class modelAuthProxy extends baseProxy {
    constructor() {
        super();
    }

    static new(assignable){
        return new Proxy(new modelAuthProxy(), new modelAuthProxyHandler(assignable));
    }
}

module.exports = modelAuthProxy;