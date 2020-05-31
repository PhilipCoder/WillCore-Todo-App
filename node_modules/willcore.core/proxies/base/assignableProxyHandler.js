const baseProxyHandler = require("./baseProxyHandler.js");
const assignable = require("../../assignable/assignable.js");
const intermediateAssignableProxy = require("../intermediateAssignable/intermediateAssignableProxy.js");
const baseProxy = require("./baseProxy.js");
const willCoreModules = require("../../moduleContainer/willCoreModules.js");

class assignableProxyHandler extends baseProxyHandler {
    constructor(assignableInstance) {
        super();
        this.getTraps = [this.getCopy, this.getStraightValue, this.getAssignable];
        this.setTraps = [this.assignStraightValue, this.assignArray, this.assignAssignable, this.assignAssignableValue, this.assignCompleted];
        this.hiddenVariables = {};
        this.hiddenVariables["_assignable"] = assignableInstance;
    }



    assignStraightValue(target, property, value, proxy) {
        if (property.startsWith("_")) {
            this.hiddenVariables[property] = value;
            return { value: true };
        }
        return { value: false, status: false };
    }

    assignArray(target, property, value, proxy) {
        if (Array.isArray(value) && (target[property] instanceof assignable || (value.length > 0 && value[0].prototype instanceof assignable))) {
            value.forEach(item => {
                proxy[property] = item;
            });
            return { value: true };
        }
        return { value: false, status: false };
    }

    assignAssignable(target, property, value, proxy) {
        if (target[property] === undefined && value.prototype instanceof assignable) {
            let result = new value();
            if (result.canAssign(proxy, property)) {
                if (result.isCompleted) {
                    target[property] = result;
                    result.completed();
                    return this.assignCompleted(target, property, value, proxy);
                }
                return { value: result, status: true }
            } else {
                throw "Invalid target proxy type for the assignable!";
            }
        }
        return { value: false, status: false }
    }

    assignAssignableValue(target, property, value, proxy) {
        if (target[property] instanceof assignable) {
            target[property].setValue(value);
        }
        return { value: false, status: false };
    }

    assignCompleted(target, property, value, proxy) {
        if (target[property] instanceof assignable && target[property].isCompleted) {
            let completionResult = target[property].completionResult();
            if (completionResult instanceof baseProxy) {
                completionResult._parent = target;
            }
            if (completionResult === false) {
                delete target[property];
                return { value: true };
            } else if (completionResult !== undefined) {
                target[property] = completionResult;
                return { value: true };
            }
        }
        if (target[property] instanceof assignable) {
            return { value: true };
        }
        return { value: false, status: false };
    }

    getStraightValue(target, property, proxy) {
        if (property.startsWith("_")) {
            return { value: this.hiddenVariables[property], status: true };
        }
        return { value: false, status: false };
    }

    getAssignable(target, property, proxy) {
        if (target[property]) {
            return { value: target[property], status: true };
        }
        else if (willCoreModules.assignables["&" + property] && willCoreModules.assignables[property].noValues && this.canAssign(proxy, willCoreModules.assignables[property])) {
            proxy[property] = willCoreModules.assignables[property];
            return { value: target[property], status: true };
        }
        else {
            return { value: intermediateAssignableProxy.new(proxy, property), status: true };
        }
    }

    canAssign(currentProxy, assignable) {
        return (Array.isArray(assignable.noValues) && assignable.noValues.filter(type => parentProxy instanceof currentProxy).length > 0) || currentProxy instanceof assignable.noValues;
    }

    getCopy(target, property, value, proxy) {
        if (property === "getCopy") {
            let result = () => {
                let handler = new this.constructor();
                handler.hiddenVariables = this.hiddenVariables;
                return new Proxy(target, handler);
            };
            return { value: result, status: true };
        }
        return { value: false, status: false };
    }

}

module.exports = assignableProxyHandler;