const assignable = require("willcore.core/assignable/assignable");
const serverProxy = require("willcore.server/proxies/server/serverProxy.js");
const session = require("../logic/session.js");
const serviceResult = require("willcore.server/models/serviceResult.js");
const sessionProxy = require("../proxies/session/sessionProxy.js");

class sessionAssignable extends assignable {
    constructor() {
        super({}, serverProxy);
        this.settings = {
            encryptionKey: "Q3UBzdH9GEfiRCTKbi5MTPyChpzXLsTD",
            driver: "memory",
            timeout: 1000000,
            sameSite: "Strict",
            expireOnClose: false,
            cookie: "willCore_session",
            domain: null
        };
        this.sessionLogic = new session(this.settings);
    }

    completed() {
        this.parentProxy._assignable.sessionLogic = this;
        this.parentProxy._assignable.globalInterceptors.push(async (requestInfo, request, response) => {
            this.sessionLogic.increaseSessionTime(request, response);
            if (this.isAuthenticated(request, response)) {
                requestInfo._parameters[this.propertyName] = this.getSessionObj(request, response);
                requestInfo._parameters[this.propertyName].authenticated = true;
            } else {
                requestInfo._parameters[this.propertyName] = {};
                requestInfo._parameters[this.propertyName].authenticated = false;
            }
            requestInfo._parameters[this.propertyName].authenticate = (sessionObj) => {
                this.setSession(sessionObj, response);
            };
            requestInfo._parameters[this.propertyName].remove = () => {
                this.sessionLogic.authenticate({}, null, response, true);
            };
        });
        this.parentProxy.indexFileSessionOnly.executableService["/session/authenticated"] = (requestInfo, request, response) => {
            let resultObj = { authenticated: false };
            if (this.isAuthenticated(request, response)) {
                resultObj = this.getSessionObj(request, response);
                resultObj.authenticated = true;
            }
            return new serviceResult(200, "application/json", JSON.stringify(resultObj));
        };
    }

    setSession(sessionObj, response) {
        this.sessionLogic.authenticate(sessionObj, null, response)
    }

    isAuthenticated(request, response) {
        return this.sessionLogic.authenticated(request, response);
    }

    getSessionObj(request, response) {
        return this.sessionLogic.getCookieObject(request, response);
    }

    completionResult() {
        return sessionProxy.new();
    }
}

module.exports = sessionAssignable;