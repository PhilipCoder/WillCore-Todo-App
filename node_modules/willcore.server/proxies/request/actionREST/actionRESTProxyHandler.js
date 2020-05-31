const requestProxyHandler = require("../requestProxyHandler.js");

class actionRESTProxyHandler extends requestProxyHandler {
    constructor(assignable) {
      super(assignable);
    }
  }
  
  module.exports = actionRESTProxyHandler;