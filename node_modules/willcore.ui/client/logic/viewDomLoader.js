import { loadHTML } from "../helpers/htmlLoader.js";
class viewDomLoader {
    constructor() {

    }

    async loadView(viewURL, viewId, html) {
        html = html || await loadHTML(`/views/${viewURL}.html`);
        html = this.getCleanedIdHTML(html, viewId);
        return html;
    }

    getCleanedIdHTML(html, viewId) {
        let newElement = document.createElement("div");
        newElement.innerHTML = html;
        let allElements = newElement.querySelectorAll("*");
        let ids = {};
        allElements.forEach(elem => {
            if (elem.getAttribute("id")) {
                let id = elem.getAttribute("id");
                if (id.indexOf(".") > -1) {
                    let idParts = id.split(".");
                    id = idParts[idParts.length - 1];
                }
                id = `${viewId}.${id}`;
                elem.setAttribute("id", id);
                if (ids[id]) {
                    throw "Duplicate Element IDs Detected!", `The view ${viewId} has more than one element with ID ${id}.`;
                }
                ids[id] = true;
            }
        });

        return newElement.innerHTML;
    }
}

export { viewDomLoader };