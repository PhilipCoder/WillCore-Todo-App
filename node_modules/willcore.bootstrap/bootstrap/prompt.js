import { assignable } from "/willcore/assignable/assignable.js"
import { guid } from "/uiModules/helpers/guid.js";
import { uiProxy } from "/uiModules/proxies/ui/uiProxy.js";

function getAlertHTML(heading, message, id, buttons) {
    let buttonsHTML = Object.keys(buttons).map(key => `<button class="btn ${buttons[key].primary ? 'btn-primary' : 'btn-secondary'}" data-prompt-key="${key}">${buttons[key].label}</button>`).join("\n");
    return `<div class="modal" tabindex="-1" role="dialog" id="${id}">
<div class="modal-dialog" role="document">
  <div class="modal-content">
    <div class="modal-header">
      <h5 class="modal-title">${heading}</h5>
    </div>
    <div class="modal-body">
      <p>${message}</p>
    </div>
    <div class="modal-footer" id="${id}footer">
        ${buttonsHTML}
    </div>
  </div>
</div>
</div>;`
}

class component extends assignable {
    constructor() {
        super({ string: 2, object: 1 }, uiProxy);
        this._element = null;
        this.id = guid();
        this.modalModel = null;
        this.modalElement = null;
    }

    get element() {
        return document.getElementsByTagName('body')[0];
    }

    completionResult() {
        let promise = new Promise((resolve, reject) => {
            document.querySelectorAll("[data-prompt-key]").forEach(element=>{
                element.onclick = () => {
                    $(this.modalElement).modal('toggle');
                    this.modalElement.remove();
                    resolve(element.getAttribute("data-prompt-key"));
                    delete this.parentProxy._target[this.propertyName];
                };
            });
        });
        promise._noIntermediateProxy = true;
        return promise;
    }

    async completed() {
        let modalHTML = getAlertHTML(this.bindedValues.string[0], this.bindedValues.string[1], this.id, this.bindedValues.object[0]);
        let modalElement = this.createElementFromHTML(modalHTML);
        this.element.appendChild(modalElement);
        $('#' + this.id).modal({ backdrop: 'static' });
        this.modalElement = modalElement;
    }

    createElementFromHTML(htmlString) {
        let div = document.createElement('div');
        div.innerHTML = htmlString.trim();
        return div.firstChild;
    }
}

export { component };
