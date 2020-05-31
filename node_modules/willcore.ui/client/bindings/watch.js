import { assignable } from "/willcore/assignable/assignable.js"
import { viewModelProxy } from "../proxies/viewModel/viewModelProxy.js";
import { dataScope } from "../binding/dataScope.js";

class component extends assignable {
    constructor() {
        super({ function: 2 }, viewModelProxy);
    }

    static get noValues() {
        return viewModelProxy;
    }

    get element() {
        this._element = this._element || this.parentProxy._element;
        return this._element;
    }

    updateBoundValues(value) {
        this.boundValueObject[this.boundProperty] = value;
    }

    completionResult() {
        return false;
    }

    bind() {
        dataScope.setBindable(this);
        try {
            this.bindedValues.function[0](this.parentProxy);
            dataScope.removeBindable();
            this.updateDOM();
        } catch (e) {
            dataScope.removeBindable();
        }
    }

    completed() {
        if (this.beforeBind) this.beforeBind();
        this.bind();
    }

    updateDOMValue() {
        this.updateDOM();
    }

    updateDOM(value) {
        this.bindedValues.function[1](this.parentProxy);
    }
}

export { component };