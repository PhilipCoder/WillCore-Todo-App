import { uiProxyHandler } from "./uiProxyHandler.js";
import { assignableProxyHandler } from "/willcore/proxies/base/assignableProxyHandler.js";

/**
 * Proxy class for the main intermediate assignable instanciation.
 */
class uiProxy extends assignableProxyHandler{
    constructor(assignable){
        super(assignable);
    }
   /**
    * Factory method.
    * @param {Proxy} parentProxy 
    * @param {String} parentProperty 
    */
    static new(parentProxy, parentProperty,assignable){
        return new Proxy(new uiProxy(), new uiProxyHandler(parentProxy,parentProperty,assignable));
    }
}

export { uiProxy };