const dbTableProxyHandler = require("./dbTableProxyHandler.js");
const baseProxy = require("willcore.core/proxies/base/baseProxy.js");

/**
 * Proxy class for the main willCore instance.
 */
class dbTableProxy extends baseProxy{
    constructor(){
        super();
    }
    /**
     * Factory method.
     * @type {InstanceType<mysqlProxy>}
     */
    static new(dbTableAssignable){
        let result = new Proxy(new dbTableProxy(), new dbTableProxyHandler(dbTableAssignable));
        return result;
    }
}

module.exports = dbTableProxy;