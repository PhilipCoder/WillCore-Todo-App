import { bindable } from "../binding/bindable.js";
import { elementProxy } from "../proxies/elementProxy/elementProxy.js";

class component extends bindable {
    constructor() {
        super({ function: 1 }, 0);
    }

    static get noName() {
        return true;
    }

    static get noValues() {
        return elementProxy;
    }

    updateDOM(value){
        this.element.disabled = !!value;
    }
}

export { component };