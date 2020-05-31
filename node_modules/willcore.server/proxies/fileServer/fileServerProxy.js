const fileServerProxyHandler = require("./fileServerProxyHandler.js");
const requestProxy = require("../request/requestProxy.js");

/**
 * Proxy class for the main willCore instance.
 */
class fileServerProxy extends requestProxy {
    constructor() {
        super();
    }
    /**
     * Factory method.
     * @type {InstanceType<requestProxyHandler>}
     */
    static new(fileServerAssignable) {
        let result = new Proxy(new fileServerProxy(), new fileServerProxyHandler(fileServerAssignable));
        return result;
    }
}

module.exports = fileServerProxy;