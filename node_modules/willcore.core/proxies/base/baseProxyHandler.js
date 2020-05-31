/* First assignment value must always be an assignable.
* Should be able to have constraints on what proxy the assignable can be assigned to
*willCore.myDB = [assignables.mysql,"connection string", "username","password"];
*willCore.myDB -> if not exists, set value to db assignable, when fully allocated, set value to db proxy.

assignables can be assigned to assignables.
*willCore.myDB = [assignables.dbSize,200];
when a assignable can take an assignable

Proxy -> set property to assignable -> set assignable -> assignment completed -> assignable returns proxy -> assign proxy to property
                                                                              -> assignable returns nothing -> leave assignable on property
                                                                              -> assignable return false -> delete property

*willCore.myDB.mysql.one.two;
Proxy -> get property -> if not exists, return intermediate assignable proxy -> on set or get assign the assignable to the parent proxy -> on get return intermediate proxy -> copy actions to main proxy.

Architecture:
Every proxy handler inherits from the base proxy handler. A list of functions will be passed down for the traps

*/

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

module.exports = baseProxyHandler;