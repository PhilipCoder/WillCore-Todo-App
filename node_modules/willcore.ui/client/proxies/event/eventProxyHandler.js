import { baseProxyHandler } from "/willcore/proxies/base/baseProxyHandler.js";
import { eventObservableInstance } from "../../logic/eventObservable.js";

class eventProxyProxyHandler extends baseProxyHandler {
    constructor(viewId) {
        super(null);
        this.viewId = viewId;
        this.setTraps.unshift(this.subscribeToEvent);
        this.setTraps.unshift(this.emitEvent);
        this.getTraps.unshift(this.unsubscribe);
    }

    subscribeToEvent(target, property, value) {
        if (typeof value === "function") {
            let result = eventObservableInstance.subscribe(property, this.viewId, value);
            return { value: result, status: true };
        }
        return { value: false, status: false }
    }

    emitEvent(target, property, value) {
        if (typeof value !== "function") {
            eventObservableInstance.emit(property, value);
            return { value: true, status: true };
        }
        return { value: false, status: false }
    }

    unsubscribe(target, property) {
        if (property === "unsubscribe") {
            let unsubscribeMethod = () => {
                eventObservableInstance.unsubscribe(this.viewId);
            };
            target[property] = unsubscribeMethod;
            return { value: unsubscribeMethod, status: true }
        }
    }

}

export { eventProxyProxyHandler };