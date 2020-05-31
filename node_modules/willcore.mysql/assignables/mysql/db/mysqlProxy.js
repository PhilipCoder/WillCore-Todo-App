const mysqlProxyHandler = require("./mysqlProxyHandler.js");
const baseProxy = require("willcore.core/proxies/base/baseProxy.js");
/**
 * Proxy class for the main willCore instance.
 */
class mysqlProxy extends baseProxy{
    constructor(){
        super();
    }
    /**
     * Factory method.
     * @type {InstanceType<mysqlProxy>}
     */
    static new(mysqlAssignable){
        let result= new Proxy(new mysqlProxy(), new mysqlProxyHandler(mysqlAssignable));
        return result;
    }
}

module.exports = mysqlProxy;