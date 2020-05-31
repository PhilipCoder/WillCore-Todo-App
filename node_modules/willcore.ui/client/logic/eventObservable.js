import { getHashValues } from "../helpers/hashURLParser.js";

class eventObservable {
    constructor() {
        //eventName, eventView
        this.events = {};
        let hashChangeFunction = () => {
            let hashValues = getHashValues();
            this.emit("navigate", hashValues);
        };
        window.onhashchange = hashChangeFunction;
        hashChangeFunction();
    }

    subscribe(eventName, eventAreaId, eventFunction) {
        this.events[eventName] = this.events[eventName] || {};
        this.events[eventName][eventAreaId] = this.events[eventName][eventAreaId] || [];
        this.events[eventName][eventAreaId].push(eventFunction);
    }

    async emit(eventName, eventData) {
        if (this.events[eventName]) {
            for (let eventAreaId in this.events[eventName]) {
                for (let eventIndex = 0; eventIndex < this.events[eventName][eventAreaId].length; eventIndex++) {
                    await this.events[eventName][eventAreaId][eventIndex](eventData);
                }
            }
        } else {
            return false;
        }
    }

    unsubscribe(eventAreaId, eventName) {
        if (!eventName) {
            for (let event in this.events) {
                if (this.events[event][eventAreaId]) {
                    delete this.events[event][eventAreaId];
                    console.log(`Unsubscribing ${event}`);
                }
            }
        } else {
            if (this.events[eventName] && this.events[eventName][eventAreaId]) {
                delete this.events[eventName][eventAreaId];
            }
        }
    }
}

const eventObservableInstance = new eventObservable();

export { eventObservable, eventObservableInstance };