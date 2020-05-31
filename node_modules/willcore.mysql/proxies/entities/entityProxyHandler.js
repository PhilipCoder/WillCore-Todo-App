class entityProxyHandler {
    constructor() {
        this._private = {};
    }
    get(target, property, proxy) {
        if (property.startsWith("_")) {
            property = property.substring(1);
        } 
        else if (property.startsWith("$")) {
            return this._private[property];
        }
        return target[property];
    }
    set(target, property, value, proxy) {
        if (property.startsWith("_")) {
            property = property.substring(1);
        }
        else if (property.startsWith("$")) {
            this._private[property] = value;
            return true;
        }
        if (this._private.$dbInstance) {
            let contextStateManager = this._private.$dbInstance._assignable.contextStateManager;
            let updateValues = {};
            updateValues[property] = value;
            contextStateManager.updateField(this._private.$tableName, updateValues, this._private.$primaryIndicator, target[this._private.$primaryIndicator])
        }
        target[property] = value;
        return true;
    }
}

module.exports = entityProxyHandler;