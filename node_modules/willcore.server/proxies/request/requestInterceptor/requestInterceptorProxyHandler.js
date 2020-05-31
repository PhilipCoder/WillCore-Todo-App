const assignableProxyHandler = require("willcore.core/proxies/base/assignableProxyHandler.js");

class requestInterceptorProxyHandler extends assignableProxyHandler {
    constructor(assignable) {
      super(assignable);
    }
  }
  
  module.exports = requestInterceptorProxyHandler;