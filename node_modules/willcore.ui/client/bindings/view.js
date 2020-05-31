import { assignable } from "/willcore/assignable/assignable.js"
import { elementProxy } from "../proxies/elementProxy/elementProxy.js";
import { view } from "../logic/view.js";

class component extends assignable {
    constructor() {
        super({ function: 1, string:1 }, elementProxy);
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

    async completed() {
         let viewInstance = new view(this.bindedValues.string[0]);
         await viewInstance.init();
         let model = await viewInstance.renderIntoElement(this.element);
         this.bindedValues.function[0](model);
    }
}

export { component };