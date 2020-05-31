const moduleProxy = require("./moduleProxy.js");

const methods = {
    getWillCorePackageName(packageName) {
        return `willcore.${packageName}`;
    },
    packageExists: function (packageName) {
        try {
            require(packageName);
            return true;
        } catch (e) {
            return false;
        }
    }
};

class willCoreModules {
    constructor() {
        this.factories = {};
    }

    get(target, property, proxy) {
        let throwError = true;
        if (property.startsWith("&")) {
            throwError = false;
            property = property.substring(1);
        }
        if (property.startsWith("_")) {
            return target[property];
        }
        else if (target[property]) {
            return target[property];
        } else if (this.factories[property]) {
            target[property] = this.factories[property]();
            return target[property];
        } else if (methods.packageExists(methods.getWillCorePackageName(property))) {
            require(methods.getWillCorePackageName(property))(proxy);
            if (this.factories[property]) {
                target[property] = this.factories[property]();
                return target[property];
            }
        }
        if (throwError){
            throw `Module ${property} does not exists!`;
        }
    }

    set(target, property, value) {
        if (property.startsWith("_")) {
            target[property] = value;
        }
        else if (value instanceof moduleProxy) {
            target[property] = value;
        } else {
            this.factories[property] = value;
        }
        return true;
    }

    static new() {
        return new Proxy(new moduleProxy(), new willCoreModules());
    }

}

module.exports = willCoreModules;