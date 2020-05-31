const uiProxyHandler = require("./uiProxyHandler.js");
const baseProxy = require("willcore.core/proxies/base/baseProxy.js");

/**
 * Proxy class for the main willCore instance.
 */
class uiProxy extends baseProxy {
    constructor() {
        super();
    }

    static new(assignable){
        return new Proxy(new uiProxy(), new uiProxyHandler(assignable));
    }
}

module.exports = uiProxy;