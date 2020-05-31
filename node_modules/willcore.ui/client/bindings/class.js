import { bindable } from "../binding/bindable.js";

class component extends bindable {
    constructor() {
        super({ function: 1 }, 0);
        this.initialDisplayState = null;
    }

    updateDOM(value) {
        if (value) {
            this.element.classList.add(this.propertyName);
        } else {
            this.element.classList.remove(this.propertyName);
        }
    }
}

export { component };