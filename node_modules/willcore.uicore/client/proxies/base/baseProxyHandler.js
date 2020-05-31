class baseProxyHandler {
    /**
     * Base class for proxy handlers
     * @param {ArrayLike<Function>} getTraps 
     * @param {ArrayLike<Function>} setTraps 
     * @param {ArrayLike<Function>} deleteTraps 
     */
    constructor() {
        if (new.target === baseProxyHandler) throw "An baseProxyHandler class can't be created directly.";
        this.getTraps = [];
        this.setTraps = [];
        this.deleteTraps = [];
    }

    get(target, property, proxy) {
        for (let trapIndex = 0; trapIndex < this.getTraps.length; trapIndex++) {
            let trapResult = this.getTraps[trapIndex].call(this, target, property, proxy);
            if (trapResult.status) {
                return trapResult.value;
            }
        }
        return target[property];
    }

    set(target, property, value, proxy) {
        for (let trapIndex = 0; trapIndex < this.setTraps.length; trapIndex++) {
            let trapResult = this.setTraps[trapIndex].call(this, target, property, value, proxy);
            if (trapResult.status) {
                target[property] = trapResult.value;
                return true;
            }
            if (trapResult.value) {
                return true;
            }
        }
    }

    deleteProperty(target, property, proxy) {
        for (let trapIndex = 0; trapIndex < this.deleteTraps.length; trapIndex++) {
            let trapResult = this.deleteTraps[trapIndex].call(this, target, property, proxy);
            if (trapResult.status) {
                return;
            }
        }
       return true;
    }
}

export { baseProxyHandler };