import { eventProxyProxyHandler } from "./eventProxyHandler.js";
import { assignableProxyHandler } from "/willcore/proxies/base/assignableProxyHandler.js";

/**
 * Proxy class for the main intermediate assignable instanciation.
 */
class eventProxy extends assignableProxyHandler{
    constructor(assignable){
        super(assignable);
    }
   /**
    * Factory method.
    * @param {Proxy} parentProxy 
    * @param {String} parentProperty 
    */
    static new(viewId){
        return new Proxy(new eventProxy(), new eventProxyProxyHandler(viewId));
    }
}

export { eventProxy };