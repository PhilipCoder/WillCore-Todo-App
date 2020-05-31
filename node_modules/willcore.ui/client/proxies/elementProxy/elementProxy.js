import { elementProxyHandler } from "./elementProxyHandler.js";
import { baseProxy } from "/willcore/proxies/base/baseProxy.js";

/**
 * Proxy class for the main intermediate assignable instanciation.
 */
class elementProxy extends baseProxy {
    constructor(assignable) {
        super(assignable);
    }
    /**
     * Factory method.
     */
    static new(element, assignable) {
        let instance = new Proxy(new elementProxy(), new elementProxyHandler(assignable));
        instance._element = element;
        return instance;
    }
}

export { elementProxy };