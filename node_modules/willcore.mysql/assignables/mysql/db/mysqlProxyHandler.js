const assignableProxyHandler = require("willcore.core/proxies/base/assignableProxyHandler");
const contextStateManager = require("../../../sqlGeneration/state/contextStateManager.js");
const dbInfoQuery = require("../../../sqlExecutor/dbInfoQuery.js");

class mysqlProxyHandler extends assignableProxyHandler {
  constructor(assignable) {
    super(assignable);
    this.getTraps.unshift(this.getTableCopy);
    this.getTraps.unshift(this.getUpdateFunction);
    this.getTraps.unshift(this.getSaveFunction);
    this.getTraps.unshift(this.getQueryDB);
    this.getTraps.unshift(this.getDBStructure);
  }

  getDBStructure(target, property, proxy) {
    if (property === "getStructure") {
      let structureFunction = async function () {
        return await dbInfoQuery.getDBInfo(proxy._assignable);
      };
      structureFunction.bind(proxy);
      return { value: structureFunction, status: true };
    }
    return { value: false, status: false };
  }

  getTableCopy(target, property, proxy) {
    if (target[property]) {
      let result = target[property].getCopy();
      let dbTableAssignable = new target[property]._assignable.constructor();
      dbTableAssignable.tableInfo = target[property]._assignable.tableInfo;
      dbTableAssignable.parentProxy = proxy;
      result._assignable = dbTableAssignable;
      return { value: result, status: true };
    }
    return { value: false, status: false };
  }

  getUpdateFunction(target, property, proxy) {
    if (property === "init") {
      let initFunction = function (dropDB) {
        proxy._assignable.dbInfo.instantiated = true;
        proxy._assignable.dbGenerator.dropDB = !!dropDB;
        return proxy._assignable.dbGenerator.generateDB();
      };
      initFunction.bind(proxy);
      return { value: initFunction, status: true };
    }
    return { value: false, status: false };
  }

  getSaveFunction(target, property, proxy) {
    if (property === "save") {
      let saveFunction = function () {
        return proxy._assignable.contextStateManager.run();
      };
      saveFunction.bind(proxy);
      return { value: saveFunction, status: true };
    }
    return { value: false, status: false };
  }

  getQueryDB(target, property, proxy) {
    if (property === "queryDB") {
        if (!proxy._assignable.dbInfo.instantiated) {
          throw "Unable to retrieve the queryDB. Database should first be instantiated via the init() command().";
        }
        let handler = new mysqlProxyHandler();
        for (let key in this.hiddenVariables) {
          handler.hiddenVariables[key] = this.hiddenVariables[key];
        }
        let mysqlAssignable = {};
        mysqlAssignable.queryExecutor = this.hiddenVariables._assignable.queryExecutor;
        mysqlAssignable.dbInfo = this.hiddenVariables._assignable.dbInfo;
        mysqlAssignable.dbGenerator = this.hiddenVariables._assignable.dbGenerator;
        mysqlAssignable.contextStateManager = new contextStateManager(this.hiddenVariables._assignable.queryExecutor,this.hiddenVariables._assignable.type);
        handler.hiddenVariables._assignable = mysqlAssignable;
        let result = new Proxy(target, handler);
        return { value: result, status: true };
    }
    return { value: false, status: false };
  }
}

module.exports = mysqlProxyHandler;