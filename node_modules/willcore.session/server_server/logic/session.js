const encryptor = require('./encryption/encryptor.js');

/**
 * Authentication class that sets a user's session data.
 * 
 * Author: Philip Schoeman.
 * */
class authentication {
    /**
     * Creates a new instance of the authentication module.
     * @param {import('http').IncomingMessage} request
     * @param {import('http').ServerResponse} response
     */
    constructor(config) {
        this.encryptor = new encryptor();
        this.config = config;
    }

    /**
     * Encrypts and sets the data of the session cookie.
     * 
     * @param {object} sessionObj
     */
    authenticate(sessionObj, request, response, logout) {
        if (!sessionObj.authenticated) {
            sessionObj.authenticated = true;
        }
        var encrypted = this.encryptor.encryptObject(sessionObj, this.config);
        var cookieString = `${this.config.cookie}=${encrypted};Path=/`;
        if (this.config.timeout) {
            cookieString += `; expires=${new Date(new Date().getTime() + (logout ? -100000 : this.config.timeout)).toUTCString()}`;
        }
        if (this.config.sameSite) {
            cookieString += `; SameSite=${this.config.sameSite}`;
        }
        if (this.config.domain) {
            cookieString += `; Secure;Domain=${this.config.domain}`;
        }
        response.setHeader('Set-Cookie', cookieString);
    }

    /**
     * Checks whether an user is authenticated.
     * */
    authenticated(request, response) {
        var cookieObj = this.getCookieObject(request, response);
        return cookieObj && cookieObj.authenticated;
    };

    /**
     * Gets the Hex encrypted data of the session cookie.
     * @param {string} cookieName
     */
    getCookieHex(cookieName, request, response) {
        var sessionCookie = request.headers.cookie;
        if (sessionCookie && typeof sessionCookie === "string" && sessionCookie.length > 0) {
            let cookies = sessionCookie.split(";");
            for (let cookieIndex = 0; cookieIndex < cookies.length; cookieIndex++) {
                var cookieParts = cookies[cookieIndex].split("=");
                if (cookieParts.length == 2 && cookieParts[0].trim() === cookieName) {
                    return cookieParts[1].trim();
                }
            }
        }
        return null;
    }

    /**
     * Decrypts and returns the session data stored in the session cookie.
     * */
    getCookieObject(request, response) {
        var cookieHex = this.getCookieHex(this.config.cookie, request, response);
        if (cookieHex) {
            return this.encryptor.decryptObject(cookieHex, this.config);
        }
        return null;
    }

    increaseSessionTime(request, response) {
        if (request.headers.cookie) {
            var sessionCookie = this.getCookieObject(request, response);
            this.authenticate(sessionCookie, request, response);
        }
    }
}

module.exports = authentication;