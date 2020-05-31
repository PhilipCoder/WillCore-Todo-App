const assignableProxyHandler = require("willcore.core/proxies/base/assignableProxyHandler.js");

class requestProxyHandler extends assignableProxyHandler {
    constructor(assignable) {
      super(assignable);
    }
  }
  
  module.exports = requestProxyHandler;