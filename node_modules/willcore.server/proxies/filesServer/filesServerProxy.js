const filesServerProxyHandler = require("./filesServerProxyHandler.js");
const requestProxy = require("../request/requestProxy.js");

/**
 * Proxy class for the main willCore instance.
 */
class filesServerProxy extends requestProxy {
    constructor() {
        super();
    }
    /**
     * Factory method.
     * @type {InstanceType<requestProxyHandler>}
     */
    static new(filesServerAssignable) {
        let result = new Proxy(new filesServerProxy(), new filesServerProxyHandler(filesServerAssignable));
        return result;
    }
}

module.exports = filesServerProxy;