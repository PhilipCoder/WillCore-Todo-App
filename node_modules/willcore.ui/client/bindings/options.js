import { bindable } from "../binding/bindable.js";
import { elementProxy } from "../proxies/elementProxy/elementProxy.js";

class component extends bindable {
    constructor() {
        super({ function: 1 }, 0);
        this.innerHTML = null;
    }

    static get noName() {
        return true;
    }

    static get noValues() {
        return elementProxy;
    }

    beforeBind() {
        this.initialHTML = this.element.innerHTML;
    }

    updateDOM(value) {//key is label, property value is value

        this.element.innerHTML = this.initialHTML;
        if (!Array.isArray(value) && typeof value === "object") {
            Object.keys(value).forEach(key => {
                let option = document.createElement("option");
                option.innerHTML = key;
                option.value = value[key];
                this.element.appendChild(option);
            });
        } else if (Array.isArray(value)) {//array of items
            value.forEach(row => {
                if (Array.isArray(row) && row.length > 1) {
                    let option = document.createElement("option");
                    option.innerHTML = row[1];
                    option.value = row[0];
                    this.element.appendChild(option);
                }
            });
        }
    }
}

export { component };