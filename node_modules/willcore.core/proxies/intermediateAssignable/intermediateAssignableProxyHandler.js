const baseProxyHandler = require("../base/baseProxyHandler.js");
const willCoreModules = require("../../moduleContainer/willCoreModules.js");
const intermediateProxy = require("../intermediate/intermediateProxy.js");

class intermediateAssignableProxyHandler extends baseProxyHandler {
    constructor(parentProxy, parentProperty,assignable) {
        super(assignable);
        this.getTraps = [this.getValue];
        this.setTraps = [this.setValue];
        this.parentProxy = parentProxy;
        this.parentProperty = parentProperty;
    }

    getValue(target, property) {
        if (willCoreModules.assignables[property]) {
            this.parentProxy[this.parentProperty] = willCoreModules.assignables[property];
            return { value: intermediateProxy.new(this.parentProxy, this.parentProperty), status: true };
        }
        throw "Invalid assignment. Only assignables can be assigned.";
    }

    setValue(target, property, value, proxy) {
        this.parentProxy[this.parentProperty] = willCoreModules.assignables[property] ? willCoreModules.assignables[property] : property;
        this.parentProxy[this.parentProperty] = typeof value === "string" && willCoreModules.assignables[property]  && !this.parentProxy[this.parentProperty] ? willCoreModules.assignables[property] : value;
        return { value: intermediateProxy.new(this.parentProxy, this.parentProperty), status: true };
    }
}

module.exports = intermediateAssignableProxyHandler;