const assignableProxyHandler = require("willcore.core/proxies/base/assignableProxyHandler.js");


class sessionProxyHandler extends assignableProxyHandler {
    constructor(assignable) {
        super(assignable);
        this.setTraps.unshift(this.encryptionKey);
        this.setTraps.unshift(this.timeout);
        this.setTraps.unshift(this.sameSite);
        this.setTraps.unshift(this.cookie);
        this.setTraps.unshift(this.domain);
    }

    encryptionKey(target, property,value, proxy) {
        if (property === "encryptionKey") {
            proxy._assignable.settings.encryptionKey = value;
            return { value: proxy._assignable.settings.encryptionKey, status: true }
        }
        return { status: false };
    }

    timeout(target, property,value, proxy) {
        if (property === "timeout") {
            proxy._assignable.settings.timeout = value;
            return { value: proxy._assignable.settings.timeout, status: true }
        }
        return { status: false };
    }

    sameSite(target, property,value, proxy) {
        if (property === "sameSite") {
            proxy._assignable.settings.sameSite = value;
            return { value: proxy._assignable.settings.sameSite, status: true }
        }
        return { status: false };
    }

    cookie(target, property,value, proxy) {
        if (property === "cookie") {
            proxy._assignable.settings.cookie = value;
            return { value: proxy._assignable.settings.cookie, status: true }
        }
        return { status: false };
    }

    domain(target, property,value, proxy) {
        if (property === "domain") {
            proxy._assignable.settings.domain = value;
            return { value: proxy._assignable.settings.domain, status: true }
        }
        return { status: false };
    }
}

module.exports = sessionProxyHandler;