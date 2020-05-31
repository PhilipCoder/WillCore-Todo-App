import { baseProxyHandler } from "../base/baseProxyHandler.js";
import { intermediateProxy } from "../intermediate/intermediateProxy.js";
import { moduleContainer } from "../moduleContainment/moduleProxyHandler.js";

class intermediateAssignableProxyHandler extends baseProxyHandler {
    constructor(parentProxy, parentProperty, assignable) {
        super(assignable);
        this.getTraps = [this.getValue];
        this.setTraps = [this.setValue];
        this.parentProxy = parentProxy;
        this.parentProperty = parentProperty;
    }

    getValue(target, property) {
        if (moduleContainer[property]) {
            this.parentProxy[this.parentProperty] = moduleContainer[property];
            return { value: intermediateProxy.new(this.parentProxy, this.parentProperty), status: true };
        }
        else if (this.parentProxy[this.parentProperty]){
            this.parentProxy[this.parentProperty] = property;
        }
        throw "Invalid assignment. Only assignables can be assigned.";
    }

    setValue(target, property, value, proxy) {
        this.parentProxy[this.parentProperty] = moduleContainer[property] ? moduleContainer[property] : property;
        this.parentProxy[this.parentProperty] = typeof value === "string" && moduleContainer[property] && !this.parentProxy[this.parentProperty] ? moduleContainer[property] : value;
        return { value: intermediateProxy.new(this.parentProxy, this.parentProperty), status: true };
    }
}

export { intermediateAssignableProxyHandler };