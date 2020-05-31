import { assignable } from "/willcore/assignable/assignable.js"
import { view } from "/uiModules/logic/view.js";
import { guid } from "/uiModules/helpers/guid.js";
import { elementProxy } from "/uiModules/proxies/elementProxy/elementProxy.js";
import { baseRequestProxy } from "/uiModules/proxies/requestProxy/baseRequestProxy.js";
import { willcoreUIInstance } from "/uiModules/assignables/uiAssignable.js";

class component extends assignable {
    constructor() {
        super({ string: 1 }, elementProxy);
        this._element = null;
        this.id = guid();
        this.modalModel = null;
    }

    get element() {
        this._element = this._element || this.parentProxy._element;
        return this._element;
    }

    completionResult() {
        return {
            _noIntermediateProxy: true,
            show: async (options, modelValues) => {
                await this.initView(modelValues);
                $("#" + this.id).modal(options);
                return new Promise(async (resolve, reject) => {
                    let closeModal = (data) => {
                        $("#" + this.id).modal('toggle');
                        resolve(data);
                    };

                    this.modalModel._target.close = closeModal;
                    await this.viewInstance.executeViewFunction(this.modalFunction);
                });
            }
        }
    }

    async completed() {

    }

    async initView(modelValues) {
        let viewInstance = new view(this.bindedValues.string[0]);
        this.viewInstance = viewInstance;
        await viewInstance.init();
        let modalDiv = document.createElement("div");
        modalDiv.innerHTML = viewInstance.html;
        modalDiv.childNodes[0].id = this.id;
        this.element.innerHTML = modalDiv.innerHTML;
        this.element.appendChild(viewInstance.createViewIndicator());
        this.modalModel = viewInstance.viewModel;
        this.modalFunction = viewInstance.viewFunction;
        if (typeof modelValues === "object" && modelValues !== null) {
            for (let key in modelValues) {
                if (typeof modelValues[key] === "object" && modelValues[key] !== null) {
                    this.modalModel[key] = modelValues[key];
                }
            }
        }
    }
}

export { component };
