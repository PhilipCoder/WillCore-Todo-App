import { assignableProxyHandler } from "/willcore/proxies/base/assignableProxyHandler.js";
import { elementProxy } from "../elementProxy/elementProxy.js"
import { dataSetProxyFactory } from "../../binding/dataSetProxy.js";

class viewModelProxyHandler extends assignableProxyHandler {
    constructor() {
        super(null);
        this.getTraps.unshift(this.getElementProxy);
        this.setTraps.unshift(this.setDataSetProxy);
        this.setTraps.unshift(this.getWindow);
        this.getTraps.unshift(this.unload);
    }

    getWindow(target, property, proxy) {
        if (property === "$window") {
            target[property] = elementProxy.new(window);
            return { value: target[property], status: true }
        }
        return { value: false, status: false }
    }

    unload(target, property) {
        if (property === "_unload") {
            target[property] = () => {
                for (let key in target) {
                    if (target[key]._unload) {
                        target[key]._unload();
                    }
                //    delete target[key];
                }
            };
            return { value: target[property], status: true }
        }
        return { value: false, status: false }
    }

    getElementProxy(target, property, proxy) {
        if (property.startsWith("$")) {
            if (target[property]) return { value: target[property], status: true }
            let id = property.substring(1);
            let elementId = `${proxy._viewId}.${id}`;
            let element = document.getElementById(elementId);
            if (elementId) {
                target[property] = elementProxy.new(element);
                return { value: target[property], status: true }
            }
        }
        return { value: false, status: false }
    }

    setDataSetProxy(target, property, value, proxy) {
        if (!property.startsWith("$") && typeof value === "object") {
            let elementId = `${proxy._viewId}.viewIndicator`;
            let element = document.getElementById(elementId);
            target[property] = dataSetProxyFactory(value, element);
            return { value: target[property], status: true }
        }
        return { value: false, status: false }
    }
}

export { viewModelProxyHandler };