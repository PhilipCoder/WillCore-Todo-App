import { bindable } from "../binding/bindable.js";

class component extends bindable {
    constructor() {
        super({ function: 1 }, 0);
    }

    updateDOM(value){
        this.element.style[this.propertyName] = value;
    }
}

export { component };