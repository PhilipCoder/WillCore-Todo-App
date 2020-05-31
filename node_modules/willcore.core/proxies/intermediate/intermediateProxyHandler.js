const baseProxyHandler = require("../base/baseProxyHandler.js");

class intermediateProxyHandler extends baseProxyHandler {
    constructor(parentProxy,parentProperty,assignable) {
        super(assignable);
        this.getTraps = [this.getValue];
        this.setTraps = [this.setValue];
        this.parentProxy = parentProxy;
        this.parentProperty = parentProperty;
    }

    getValue(target, property, proxy) {
        this.parentProxy[this.parentProperty] = property;
        return { value: proxy, status:true };
    }

    setValue(target, property, value, proxy) {
        this.parentProxy[this.parentProperty] = property;
        this.parentProxy[this.parentProperty] = value;
        return { value: true, status:false };
    }

}

module.exports = intermediateProxyHandler;