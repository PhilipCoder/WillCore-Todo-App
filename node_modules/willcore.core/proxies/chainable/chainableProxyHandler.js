const baseProxyHandler = require("../base/baseProxyHandler.js");
const chainableProxy = require("./chainableProxy.js");

class chainableProxyHandler extends baseProxyHandler {
    constructor(name) {
        super();
        this.getTraps = [this.getName, this.getValue];
        this.name = Array.isArray(name) ? name : [name];
    }

    static new(name){
        return new Proxy(new chainableProxy(), new chainableProxyHandler(name));
    }

    getValue(target, property, proxy) {
        let name = this.name.slice();
        name.push(property);
        return { value: chainableProxyHandler.new(name), status:true };
    }

    getName(target, property, proxy){
        return property === "_name" ? { value: this.name, status:true } : { value: true };
    }
}

module.exports = chainableProxyHandler;