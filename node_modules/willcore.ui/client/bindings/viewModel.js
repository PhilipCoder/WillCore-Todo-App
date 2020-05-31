import { assignable } from "/willcore/assignable/assignable.js"
import { elementProxy } from "../proxies/elementProxy/elementProxy.js";

class component extends assignable {
    constructor() {
        super({}, elementProxy);
    }

    static get noValues() {
        return elementProxy;
    }

    get element() {
        this._element = this._element || this.parentProxy._element;
        return this._element;
    }

    completionResult() {
        if  (this.element.model){
            this.element.model._noIntermediateProxy = true;
        }
        this.parentProxy._target.viewModel = this.element.model;
    }

    completed() {

    }
}

export { component };