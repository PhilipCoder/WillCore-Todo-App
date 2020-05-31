//DB -> proxy
//DB (tables)-> proxy -> tables -> proxy ()

class partialContainerProxyHandler {
    constructor(parentProxy, parentProperty) {
        this.parentProxy = parentProxy;
        this.parentProperty = parentProperty;
    }

    get(target, property) {
        if (property.startsWith("<")) {
            if (this.parentProxy === undefined) throw "Unable to move up in the container chain. Parent proxy not defined.";
            property = property.substring(1);
            return target[property];
        }
        return target[property];
    }

    set(target, property, value) {
        target[property] = value;
        if (this.parentProxy) {
            this.parentProxy[this.parentProperty] = target;
        }
        return true;
    }

    delete(target, property) {
        delete target[property];
        if (this.parentProxy) {
            this.parentProxy[this.parentProperty] = target;
        }
        return true;
    }
}

module.exports = partialContainerProxyHandler;