const requestProxyHandler = require("./requestProxyHandler.js");
const baseProxy = require("willcore.core/proxies/base/baseProxy.js");

/**
 * Proxy class for the main willCore instance.
 */
class requestProxy extends baseProxy {
    constructor() {
        super();
    }
}

module.exports = requestProxy;