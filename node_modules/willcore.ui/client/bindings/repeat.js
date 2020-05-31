import { bindable } from "../binding/bindable.js";
import { elementProxy } from "../proxies/elementProxy/elementProxy.js";

class component extends bindable {
    constructor() {
        super({ function: 2 }, 0);
        this.parentElement = null;
    }

    static get noValues() {
        return elementProxy;
    }

    beforeBind() {
        this.parentElement = this.element.parentElement;
        this.originalChildren = this.clearIds(this.getCopyOfElements([this.element]));
    }


    updateDOM(values) {
        if (!values) return;
        if (!Array.isArray(values)) throw "Only arrays are allowed to be bound by the repeat bindable.";
        this.parentElement.innerHTML = "";
        let valueIndex = 0;
        values.forEach((value) => {
            let model = this.getModel();
            if (typeof model.model !== "object") throw "Repeats can only bind to array of objects!";
            model.elements.forEach((element) => this.parentElement.appendChild(element));
            this.bindedValues.function[1](model.model, valueIndex);
            valueIndex++;
        });
    }

    getModel() {
        let elements = this.getCopyOfElements(this.originalChildren);
        let model = {};
        this.getModelLevel(elements, model);
        return { model: model, elements: elements };
    }

    getModelLevel(elements, model) {
        elements.forEach((element) => {
            if (element.id) {
                model[`$${element.id}`] = elementProxy.new(element);
            }
            let children = Array.from(element.childNodes);
            if (children.length > 0) {
                this.getModelLevel(children, model);
            }
        });
    }

    getCopyOfElements(nodes) {
        var result = [];
        for (var i = 0; i < nodes.length; i++) {
            result.push(nodes[i].cloneNode(true));
        }
        return result;
    }

    clearIds(nodes) {
        for (let i = 0; i < nodes.length; i++) {
            let node = nodes[i];
            if (node.id && node.id.indexOf(".") > -1) {
                node.id = node.id.split(".")[1];
            }
            if (node.children) {
                this.clearIds(node.children);
            }
        }
        return nodes;
    }
}

export { component };