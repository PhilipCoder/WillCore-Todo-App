const assignableProxyHandler = require("willcore.core/proxies/base/assignableProxyHandler.js");


class modelAuthProxyHandler extends assignableProxyHandler {
    constructor(assignable) {
        super(assignable);
        this.getTraps.unshift(this.authenticated);
        this.getTraps.unshift(this.sessionObj);
        this.getTraps.unshift(this.session);
    }

    authenticated(target, property, proxy) {
        if (property === "verifySession") {
            return {
                value: () => this.isAuthenticated(proxy), status: true
            };
        }
        return { status: false };
    }

    sessionObj(target, property, proxy) {
        if (property === "getSession") {
            return {
                value: () => this.getSessionObj(proxy), status: true
            };
        }
        return { status: false };
    }

    session(target, property, proxy) {
        if (property === "setSession") {
            return {
                value: () => this.getSessionObj(proxy), status: true
            };
        }
        return { status: false };
    }

    isAuthenticated(proxy) {
        let _sessionAuthentication = proxy._assignable.parentProxy.parentProxy._assignable.parentProxy._sessionAuthentication;
        if (!_sessionAuthentication) "No session provider was found on the server";
        return _sessionAuthentication.isAuthenticated(proxy._assignable.parentProxy._request, proxy._assignable.parentProxy._response);
    }

    getSessionObj(proxy) {
        let _sessionAuthentication = proxy._assignable.parentProxy.parentProxy._assignable.parentProxy._sessionAuthentication;
        if (!_sessionAuthentication) "No session provider was found on the server";
        return _sessionAuthentication.getSessionObj(proxy._assignable.parentProxy._request, proxy._assignable.parentProxy._response);
    }

    setSession(proxy, sessionObj) {
        let _sessionAuthentication = proxy._assignable.parentProxy.parentProxy._assignable.parentProxy._sessionAuthentication;
        if (!_sessionAuthentication) "No session provider was found on the server";
        return _sessionAuthentication.setSession(sessionObj, proxy._assignable.parentProxy._response);
    }

}

module.exports = modelAuthProxyHandler;