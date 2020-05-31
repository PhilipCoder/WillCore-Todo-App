import { assignable } from "/willcore/assignable/assignable.js"
import { guid } from "/uiModules/helpers/guid.js";
import { uiProxy } from "/uiModules/proxies/ui/uiProxy.js";


function getAlertHTML(heading, message, id, css) {
    return `<div class="toast" role="alert" aria-live="assertive" aria-atomic="true" id="${id}" style="min-width:270px">
  <div class="toast-header ${css}">
    <strong class="mr-auto">${heading}</strong>
    <button type="button" class="ml-2 mb-1 close" id="${id}Close" aria-label="Close">
      <span aria-hidden="true">&times;</span>
    </button>
  </div>
  <div class="toast-body">
    ${message}
  </div>
</div>`
}

class component extends assignable {
    constructor() {
        super({ string: 2,object:1 }, uiProxy);
        this._element = null;
        this.id = guid();
        this.modalModel = null;
        this.modalElement = null;
    }

    static get noValues() {
        return uiProxy;
    }

    get element() {
        this.loadPlacementArea();
        return document.getElementById("toastPlacement");
    }

    completionResult() {
        document.getElementById(`${this.id}Close`).onclick = () =>{
            $(document.getElementById(this.id)).toast('hide');
        };
        $(this.modalElement).on('hidden.bs.toast',()=>{
            document.getElementById(this.id).remove();
        });
        return false;
    }

    async completed() {
        let toastStyle = this.bindedValues.object[0].style || "default";
        if (toastStyle !== "info" && toastStyle !== "success" && toastStyle !== "warning" && toastStyle !== "danger" && toastStyle !== "default") throw `Invalid toast type: ${toastStyle}`;
        this.loadPlacementArea();
        let modalHTML = getAlertHTML(this.bindedValues.string[0], this.bindedValues.string[1], this.id,this.getCSSClasses(toastStyle));
        let modalElement = this.createElementFromHTML(modalHTML);
        this.element.appendChild(modalElement);
        $('#' + this.id).toast({delay:this.bindedValues.object[0].delay || 5000}).toast('show');
        this.modalElement = modalElement;
    }

    createElementFromHTML(htmlString) {
        let div = document.createElement('div');
        div.innerHTML = htmlString.trim();
        return div.firstChild;
    }

    getCSSClasses(type){
        let result = "";
        if (type === "info"){
            result = "bg-info text-white"; 
        }else if (type==="success"){
            result = "bg-success text-white";
        }else if (type ==="warning"){
            result = "bg-warning text-white";
        }else if (type === "danger"){
            result = "bg-danger text-white";
        }
        return result;
    }

    loadPlacementArea() {
        if (!document.getElementById("toastPlacement")) {
            const placementHTML = `<div aria-live="polite" aria-atomic="true" style="position: absolute;top:10px;right:10px;min-width:600px;"><div style="position: absolute; top: 0; right: 0;" id="toastPlacement"></div></div>`;
            let placementElement = this.createElementFromHTML(placementHTML);
            document.getElementsByTagName('body')[0].appendChild(placementElement);
        }
    }
}

export { component };
