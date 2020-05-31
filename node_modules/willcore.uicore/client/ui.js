import { willCoreProxyHandler } from "./proxies/willCore/willCoreProxyHandler.js";
import { baseProxy } from "./proxies/base/baseProxy.js";
import { moduleContainer } from "./proxies/moduleContainment/moduleProxyHandler.js";

/**
 * Proxy class for the main willCore instance.
 */
class willCoreProxy extends baseProxy {
    constructor(assignable) {
        super(assignable);
    }
    /**
     * Factory method.
     * @type {InstanceType<willCoreProxy>}
     */
    static async new(assignable) {
        await moduleContainer.prepopulate();
        return new Proxy(new willCoreProxy(), new willCoreProxyHandler(assignable));
    }
}

export { willCoreProxy };