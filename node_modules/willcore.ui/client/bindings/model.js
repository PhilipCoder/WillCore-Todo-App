import { bindable } from "../binding/bindable.js";
import { elementProxy } from "../proxies/elementProxy/elementProxy.js";

class component extends bindable {
    constructor() {
        super({ function: 1 }, 0);
        this.twoWayBinding = true;
    }

    static get noName() {
        return true;
    }

    static get noValues() {
        return elementProxy;
    }

    updateDOM(value) {
        this.element.value = value;
    }

    completionResult() {
        if (this.element.type == "checkbox" || this.element.type == "radio") {
            this.element.onclick = function (event) {
                this.updateBoundValues(!!this.element.checked);
                return true;
            };
        } else if (this.element.type == "file")
            this.element.onchange = (event) => {
                this.loadFileBytes(this.boundValueObject,this.boundProperty);
                return true;
            };
        else {
            this.element.oninput = (event) => {
                let value = "";
                if ("value" in this.element) {
                    value = this.element.value;
                } else {
                    throw "This type of model binding is not supported (yet)";
                }
                this.updateBoundValues(value);
                return true;
            };
        }
    }

    loadFileBytes(receiver, property) {
        let reader = new FileReader();
        reader.onload = function () {
            let arrayBuffer = new Uint8Array(this.result);
            receiver[property] = Array.from(arrayBuffer.values());
        };
        reader.readAsArrayBuffer(this.element.files[0]);
    }

    getBase64(bytes) {
        let binary = '';
        let len = bytes.length;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
    }
}

export { component };