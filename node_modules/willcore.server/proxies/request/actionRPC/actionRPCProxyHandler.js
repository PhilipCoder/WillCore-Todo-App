const requestProxyHandler = require("../requestProxyHandler.js");

class actionRPCProxyHandler extends requestProxyHandler {
    constructor(assignable) {
      super(assignable);
    }
  }
  
  module.exports = actionRPCProxyHandler;