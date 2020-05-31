import { serviceProxy } from "./serviceProxy.js";

const proxyHandler = {
    get(target, property) {
        return serviceProxy.new(property);
    }
};

class baseRequestProxy {
    constructor() {

    }

    static new() {
        return new Proxy(new baseRequestProxy(), proxyHandler);
    }
}

export {baseRequestProxy};