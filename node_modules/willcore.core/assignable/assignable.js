/**
 * Base assignable class
 * 
 */
class assignable {
    /**Constructor, must be called from the inherting class
     * 
     * @param {object} bindingConstraints An object containing the types of values that can be assinged.
     */
    constructor(bindingConstraints, targetAssignableProxy) {
        if (new.target === assignable) throw "An assignable class can't be created directly.";
        if (typeof bindingConstraints !== "object") throw "Binding constraints not provided.";
        if (!targetAssignableProxy) throw "The target assignable proxy has not been defined.";
        this.bindingConstraints = bindingConstraints;
        this.bindedValues = {};
        this.name = new.target.name;
        this.targetAssignableProxy = targetAssignableProxy;
        this.parentProxy = null;
        this.propertyName = null;
    }

    /**
     * Indicates if a assignable is fully assigned.
     * @type {boolean}
     */
    get isCompleted() {
        for (let key in this.bindingConstraints) {
            if (!this.bindedValues[key] || this.bindingConstraints[key] !== this.bindedValues[key].length) return false;
        }
        return true;
    }

    /**
     * Checks if the assignable can be assigned to an proxy.
     * @param {object} parentProxy 
     * @param {string} propertyName 
     */
    canAssign(parentProxy, propertyName) {
        if ((Array.isArray(this.targetAssignableProxy) && this.targetAssignableProxy.filter(type => parentProxy instanceof type).length > 0) || parentProxy instanceof this.targetAssignableProxy){
            this.propertyName = propertyName;
            this.parentProxy = parentProxy;
            return true;
        }
        return false;
    }

    /**
     * Assignes a value to an assignable
     * @param {any} value 
     */
    setValue(value) {
        if (this.bindingConstraints[typeof value] && this.bindingConstraints[typeof value] > (this.bindedValues[typeof value] ? this.bindedValues[typeof value].length : 0)) {
            this.bindedValues[typeof value] = this.bindedValues[typeof value] || [];
            this.bindedValues[typeof value].push(value);
            if (this.isCompleted) {
                this.completed();
            }
        } else if (!this.bindingConstraints[typeof value]) {
            throw `Unsupported assignment. The assignable ${this.name} does not support a binding of type ${typeof value}.`;
        } else {
            throw `Unsupported assignment. The assignable ${this.name} is already fully binded to value of type ${typeof value}.`;
        }
    }
}

module.exports = assignable;