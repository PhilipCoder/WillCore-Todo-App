const requestProxyHandler = require("../request/requestProxyHandler.js");

class filesServerProxyHandler extends requestProxyHandler {
    constructor(assignable) {
      super(assignable);
    }
  }
  
  module.exports = filesServerProxyHandler;