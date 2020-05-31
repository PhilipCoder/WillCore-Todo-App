import { actionProxy } from "./actionProxy.js";

const proxyHandler = {
    get(target, property) {
        return actionProxy.new(target.serviceName, property);
    }
};

class serviceProxy {
    constructor(serviceName) {
        this.serviceName = serviceName;
    }

    static new(serviceName) {
        return new Proxy(new serviceProxy(serviceName), proxyHandler);
    }
}

export { serviceProxy };