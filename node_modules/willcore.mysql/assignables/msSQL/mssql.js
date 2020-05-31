const assignable = require("willcore.core/assignable/assignable");
const willCoreProxy = require("willcore.core");
const mysqlProxy = require("./db/mysqlProxy.js");
const dbMigrationSetup = require("./setup/dbMigrationSetup.js");
const dbGenerator = require("../../sqlGeneration/dbGenerator.js");
const queryExecutor = require("../../sqlExecutor/runQuery.js");
class mssql extends assignable {
    constructor() {
        super({ string: 3 }, willCoreProxy);
        this.type = "msSQL"
        this.dbInfo = {
            name: null,
            connectionString: null,
            userName: null,
            password: null,
            tables: []
          
        };
        this.dbGenerator = null;
        this.contextStateManager = null;
        this.queryExecutor = null;
    }

    completionResult() {
        let proxyResult = mysqlProxy.new(this);
        dbMigrationSetup.setupTables(proxyResult, this.propertyName);
        this.queryExecutor = new queryExecutor(this.dbInfo.connectionString,this.dbInfo.userName, this.dbInfo.password,this.dbInfo.name);
        this.dbGenerator = new dbGenerator(proxyResult,this.queryExecutor);
        return proxyResult;
    }

    completed() {
        this.dbInfo.name = this.propertyName;
        this.dbInfo.connectionString = this.bindedValues.string[0];
        this.dbInfo.userName = this.bindedValues.string[1];
        this.dbInfo.password = this.bindedValues.string[2];
    }

    getDBJson() {
        return JSON.stringify(this.dbInfo);
    }
}

module.exports = mssql;