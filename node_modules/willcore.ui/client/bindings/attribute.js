import { bindable } from "../binding/bindable.js";

class component extends bindable {
    constructor() {
        super({ function: 1 }, 0);
    }

    updateDOM(value) {
        this.element.setAttribute(this.propertyName, value);
    }
}

export { component };