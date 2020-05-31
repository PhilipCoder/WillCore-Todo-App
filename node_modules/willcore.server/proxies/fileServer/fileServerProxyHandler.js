const requestProxyHandler = require("../request/requestProxyHandler.js");

class fileServerProxyHandler extends requestProxyHandler {
    constructor(assignable) {
      super(assignable);
    }
  }
  
  module.exports = fileServerProxyHandler;