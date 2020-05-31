import { assignable } from "/willcore/assignable/assignable.js"
import { elementProxy } from "../proxies/elementProxy/elementProxy.js";

class component extends assignable {
    constructor() {
        super({ function: 1 }, elementProxy);
        this._element = null;
    }

    static get noValues() {
        return elementProxy;
    }

    get element() {
        this._element = this._element || this.parentProxy._element;
        return this._element;
    }

    completionResult() {
        return false;
    }

    completed() {
        this.element[this.propertyName] = (event) => {
            this.bindedValues.function[0](event);
            return true;
        };
    }
}

export { component };