﻿var session = require('./session.js');
class authenticationRequest {
    /**
    * Middleware entry point
    * @param {import('http').IncomingMessage} request
    * @param {import('http').ServerResponse} response
    */
    checkAuthentication(request, response, config) {
        var sessionInstance = new session(request, response, config);
        this.increaseSessionTime(request, sessionInstance);
        if (!this.shouldProcessRequest(request)) return false;
        this.processAuthenticationRequest(sessionInstance, response);
        return true;
    }

    processAuthenticationRequest(sessionInstance, response) {
        var result = sessionInstance.getCookieObject();
        result = result || { authenticated: false };
        response.writeHead(200, { 'Content-Type': "application/json", 'Cache-Control': 'no-cache' });
        response.end(JSON.stringify(result));
    }

    increaseSessionTime(request, sessionInstance) {
        if (request.headers.cookie) {
            var sessionCookie = sessionInstance.getCookieObject();
            sessionInstance.authenticate(sessionCookie);
        }
    }
}

module.exports = authenticationRequest;