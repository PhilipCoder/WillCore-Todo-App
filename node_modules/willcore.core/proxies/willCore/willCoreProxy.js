const proxyHandler = require("./willCoreProxyHandler.js");
const baseProxy = require("../../proxies/base/baseProxy.js");
/**
 * Proxy class for the main willCore instance.
 */
class willCoreProxy extends baseProxy{
    constructor(assignable){
        super(assignable);
    }
    /**
     * Factory method.
     * @type {InstanceType<willCoreProxy>}
     */
    static new(assignable){
        return new Proxy(new willCoreProxy(), new proxyHandler(assignable));
    }
}

module.exports = willCoreProxy;