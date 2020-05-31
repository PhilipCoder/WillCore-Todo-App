import { assignable } from "/willcore/assignable/assignable.js"
import { elementProxy } from "/uiModules/proxies/elementProxy/elementProxy.js";

class component extends assignable {
    constructor() {
        super({ object: 1 }, elementProxy);
        this._element = null;
        this.modalModel = null;
    }

    get element() {
        this._element = this._element || this.parentProxy._element;
        return this._element;
    }

    static get noValues() {
        return elementProxy;
    }

    completionResult() {
        return {
            _noIntermediateProxy: true,
            toggle:function(){
                $(this.element).popover('toggle');
            }
        }
    }

    async completed() {
        $(this.element).popover(this.bindedValues.object[0]);
    }
}

export { component };
