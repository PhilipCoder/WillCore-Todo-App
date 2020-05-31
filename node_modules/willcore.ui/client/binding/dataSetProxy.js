import { dataScope } from "./dataScope.js";

class dataSetProxyHandler {
    constructor(value, viewElement) {
        if (typeof value === "object") {
            for (let key in value) {
                if (typeof value[key] === "object" && value[key] !== null && !value[key]._isDataSet) {
                    value[key] = dataSetProxyFactory(value[key], this.viewElement);
                }
            }
        }
        this.bindings = {};
        this.viewElement = viewElement;
    }
    //Set
    set(target, property, value, proxy) {
        this.ensureBindingArray(property);
        if (typeof value === "object") {
            this.handleObjectAssignment(target, property, value);
        } else {
            this.handleAssignment(target, property, value);
        }
        return true;
    }

    handleAssignment(target, property, value) {
        target[property] = value;
        this.bindings[property].forEach((binding) => {
            if (binding !== dataScope.bindable) {
                binding.updateDOMValue(value);
            }
        });
    }

    handleObjectAssignment(target, property, value) {
        let previousValue = target[property];
        target[property] = dataSetProxyFactory(value._isDataSet ? value._target : value, this.viewElement);
        this.bindings[property].forEach((binding) => {
            binding.bind();
        });
        if (typeof previousValue === "object" && previousValue._handler) {
            previousValue._handler.rebindAll(previousValue._target);
        }
    }

    rebindAll(target) {
        Object.keys(this.bindings).forEach(
            (bindings) => {
                this.bindings[bindings].forEach((binding) => {
                    binding.bind();
                });
                if (typeof target[bindings] === "object" && target[bindings] !== null && target[bindings]._handler) {
                    target[bindings]._handler.rebindAll(target[bindings]._target);
                }
            }
        );
        Object.keys(this.bindings).forEach((key) => {
            this.bindings[key] = this.bindings[key].filter((binding) =>
                (binding.element && binding.element.isConnected) || !binding.element);
            if (this.bindings[key].length === 0) {
                delete this.bindings[key];
            }
        });
    }

    ensureBindingArray(property) {
        if (!this.bindings[property]) {
            this.bindings[property] = [];
        }
    }

    //Get
    get(target, property, proxy) {
        if (property === "_unbind") {//memory management
            return () => {
                Object.keys(this.bindings).forEach(
                    key => {
                        this.bindings[key].forEach((binding) => {
                            if (binding.unbind) {
                                binding.unbind();
                            }
                        })
                    });
                this.bindings = {};
                for (let key in target) {
                    if (target[key]._unbind) {
                        target[key]._unbind();
                    }
                }
            };
        }
        else if (this.viewElement && !this.viewElement.isConnected) {
            proxy._unbind();
            return target[property];
        }
        else if (property === "_target") {
            return target;
        }
        else if (property === "_isDataSet") {
            return true;
        }
        else if (property === "_handler") {
            return this;
        }
        else if (dataScope.hasBindable()) {
            this.ensureBindingArray(property);
            this.bindings[property].push(dataScope.bindable);
            if (dataScope.bindable.twoWayBinding) {
                dataScope.bindable.boundValueObject = proxy;
                dataScope.bindable.boundProperty = property;
            }
        }
        return target[property];
    }

    //Delete
    delete(target, property) {
        delete target[property];
        this.bindings[property].forEach((binding) => {
            binding.bind();
        });
    }
}

let dataSetProxyFactory = (target, viewElement) => {
    target = target || {};
    return new Proxy(target, new dataSetProxyHandler(target, viewElement))
};

export { dataSetProxyFactory };