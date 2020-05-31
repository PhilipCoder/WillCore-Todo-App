const baseProxyHandler = require("willcore.core/proxies/base/assignableProxyHandler.js");

class serviceProxyHandler extends baseProxyHandler {
    constructor(assignable) {
      super(assignable);
    }
  }
  
  module.exports = serviceProxyHandler;