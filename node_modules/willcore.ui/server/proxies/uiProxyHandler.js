const assignableProxyHandler = require("willcore.core/proxies/base/assignableProxyHandler.js");


class uiProxyHandler extends assignableProxyHandler {
    constructor(assignable) {
        super(assignable);
        this.getTraps.unshift(this.addClientAssignable);
    }

    addClientAssignable(target, property, proxy) {
        if (property === "addClientAssignable") {
            return { value: proxy._assignable.addClientAssignable, status: true }
        }
        return { status: false };
    }
}

module.exports = uiProxyHandler;