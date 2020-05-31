import { assignable } from "/willcore/assignable/assignable.js"
import { viewModelProxy } from "../proxies/viewModel/viewModelProxy.js";
import {getHashValues} from "../helpers/hashURLParser.js";

class component extends assignable {
    constructor() {
        super({}, viewModelProxy);
    }

    static get noValues() {
        return viewModelProxy;
    }

    get element() {
        this._element = this._element || this.parentProxy._element;
        return this._element;
    }

    completionResult() {
        let parameterObj = getHashValues();
        parameterObj._noIntermediateProxy = true;
        parameterObj.navigate = this.navigate;
        this.getURLParameters(parameterObj);
        this.parentProxy.location = parameterObj;
        return this.parentProxy.location;
    }

    completed() {

    }

    getURLParameters(objectToAssignTo) {
        let url = window.location.hash.slice(1) || "/";
        if (url.indexOf("?") > -1) {
            url = url.substring(url.indexOf("?") + 1);
        } else {
            return;
        }
        let urlParameters = url.split("&");
        urlParameters.forEach(parameter => {
            let segments = parameter.split("=");
            if (segments.length !== 2) {
                willCoreModules.execptionHander.handleExeception("Invalid URL parameters", `Unable to parse the current URL to any meaningful values.`);
            }
            objectToAssignTo[segments[0]] = decodeURIComponent(segments[1]);
        });
    }

    navigate(route, routeParameters) {
        let parameters = [];
        let parameterString = "";
        if (routeParameters && typeof routeParameters === "object") {
            for (let key in routeParameters) {
                parameters.push(`${key}=${encodeURIComponent(routeParameters[key])}`);
            }
            if (parameters.length > 0) {
                parameterString = "?" + parameters.join("&");
            }
        }
        var forceUrl = false;
        let url = window.location.hash.slice(1) || "/";
        if (url.indexOf("?") > -1) {
            url = url.substring(url.indexOf("?"));
            forceUrl = url.indexOf("forceUrl=true") > -1;
        }
        if (!forceUrl) {
            window.location.hash = route + parameterString;
        }
    }
}

export { component };