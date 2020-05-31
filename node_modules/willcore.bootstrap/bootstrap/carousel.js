import { assignable } from "/willcore/assignable/assignable.js"
import { elementProxy } from "/uiModules/proxies/elementProxy/elementProxy.js";

class component extends assignable {
    constructor() {
        super({ object: 1 }, elementProxy);
        this._element = null;
        this.modalModel = null;
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

    async completed() {
        $(this.element).carousel(this.bindedValues.object[0]);
    }
}

export { component };
