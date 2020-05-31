const assignableProxyHandler = require("../base/assignableProxyHandler.js");

class willCoreProxyHandler extends assignableProxyHandler {
    constructor(assignable) {
        super(assignable);
    }
}

module.exports = willCoreProxyHandler;