import { viewModelProxyHandler } from "./viewModelProxyHandler.js";
import { baseProxy } from "/willcore/proxies/base/baseProxy.js";
import {getHashValues} from "../../helpers/hashURLParser.js";

/**
 * Proxy class for the main intermediate assignable instanciation.
 */
class viewModelProxy extends baseProxy {
    constructor(assignable) {
        super(assignable);
    }
    /**
     * Factory method.
     * @param {Proxy} parentProxy 
     * @param {String} parentProperty 
     */
    static new(viewId) {
        let instance = new Proxy(new viewModelProxy(), new viewModelProxyHandler());
        instance._viewId = viewId;
        return instance;
    }
}

export { viewModelProxy };