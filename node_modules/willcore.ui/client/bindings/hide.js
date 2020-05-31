import { bindable } from "../binding/bindable.js";
import { elementProxy } from "../proxies/elementProxy/elementProxy.js";

class component extends bindable {
    constructor() {
        super({ function: 1 }, 0);
        this.initialDisplayState = null;
    }

    static get noName() {
        return true;
    }

    static get noValues() {
        return elementProxy;
    }

    beforeBind(){
        let display = getComputedStyle(this.element).display;
        this.initialDisplayState = !display || display === "none" ? "block" : display;
    }

    updateDOM(value){
        this.element.style.display = value ? "none" : this.initialDisplayState;
    }
}

export { component };