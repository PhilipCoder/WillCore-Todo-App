const sessionProxyHandler = require("./sessionProxyHandler.js");
const baseProxy = require("willcore.core/proxies/base/baseProxy.js");

/**
 * Proxy class for the main willCore instance.
 */
class sessionProxy extends baseProxy {
    constructor() {
        super();
    }

    static new(assignable){
        return new Proxy(new sessionProxy(), new sessionProxyHandler(assignable));
    }
}

module.exports = sessionProxy;