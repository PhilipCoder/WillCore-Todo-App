import { requestFunction } from "./requestFunction.js";

const proxyHandler = {
    get(target, property) {
        const httpVerbs = {
            PUT: true,
            POST: true,
            GET: true,
            DELETE: true,
            PATCH: true
        };
        property = property.toUpperCase();
        if (!httpVerbs[property]) throw `Invalid HTTP verb ${property}`;
        return requestFunction(target.serviceName, target.actionName, property);
    }
};

class actionProxy {
    constructor(serviceName, actionName) {
        this.serviceName = serviceName;
        this.actionName = actionName;
    }

    static new(serviceName, actionName) {
        return new Proxy(new actionProxy(serviceName, actionName), proxyHandler);
    }
}

export { actionProxy };