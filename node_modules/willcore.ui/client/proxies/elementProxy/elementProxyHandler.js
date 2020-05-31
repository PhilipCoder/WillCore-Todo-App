import { assignableProxyHandler } from "/willcore/proxies/base/assignableProxyHandler.js";

class elementProxyHandler extends assignableProxyHandler {
    constructor() {
        super(null);
        this.getTraps.unshift(this.getTarget);
    }


    getTarget(target, property, proxy) {
        if (property === "_target") {
            return { status: true, value: target };
        }
        return { status: false };
    }
}

export { elementProxyHandler };