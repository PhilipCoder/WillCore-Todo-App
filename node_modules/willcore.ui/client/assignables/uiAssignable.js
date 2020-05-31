import { assignable } from "/willcore/assignable/assignable.js"
import { willCoreProxy } from "/willcore/ui.js";
import { router } from "../logic/router.js";;
import { uiProxy } from "../proxies/ui/uiProxy.js"

let willcoreUIInstance = null;

class component extends assignable {
    constructor() {
        super({}, willCoreProxy);
        this.router = null;
    }

    static get noValues() {
        return willCoreProxy;
    }

    completionResult() {
        willcoreUIInstance = uiProxy.new(this.parentProxy, this.propertyName, this);
        return willcoreUIInstance;
    }

    completed() {
        this.router = new router(this.parentProxy);
        if (window.location.hash.length === 0) {
            this.router.navigate("/");
        }
    }
}

export { component, willcoreUIInstance };