const migrationComparitor = require("./migration/migrationComparitor.js");
const dbStatus = require("../sqlGeneration/migration/statusEnum.js");
const migrationSetup = require("../assignables/mysql/setup/dbMigrationSetup.js");
/**
 * Core DB / Migration class.
 * Author: Philip Schoeman
 */
class dbGenerator {
    /**
     * @param {assignable} mySqlAssignable 
     */
    constructor(mySqlProxy, queryExecutor) {
        this._proxy = mySqlProxy;
        this._dbInfo = mySqlProxy._assignable.dbInfo;
        this._queryExecutor = queryExecutor;
        this._comparisonInfo = null;
        this._comparisonTarget = null;
        this._comparisonSource = null;
        this._dropDB = false;
    }

    //Properties
    /** Indicates if the database should be dropped and recreated every time the database is initialized. */
    get dropDB() {
        return this._dropDB;
    }

    /** Indicates if the database should be dropped and recreated every time the database is initialized. */
    set dropDB(value) {
        this._dropDB = value;
    }

    /** The database core information structure */
    get dbInfo() {
        return this._dbInfo;
    }

    /** The comparison database core information structure. */
    get comparisonInfo() {
        return this._comparisonInfo || null;
    }

    /** The comparison target database core information structure. */
    get comparisonTarget() {
        privateLogic.assignComparisonValues.call(this);
        return this._comparisonTarget;
    }

    /** The comparison source database core information structure. */
    get comparisonSource() {
        privateLogic.assignComparisonValues.call(this);
        return this._comparisonSource;
    }

    /** Gets the database generation SQL */
    get sql() {
        let dbType = this._proxy ? this._proxy._assignable.type : "mySQL";
        let db = require(`./components/${dbType}/db.js`);
        return new db(this.comparisonTarget, this.comparisonSource, this._dropDB).getSQL();
    }

    //Methods
    /** Calls the getters and setters of the comparative target and source databases to update them. */
    updateTargets() {
        return new Promise(async (resolve, reject) => {
            if (!this._dropDB) {
                this._comparisonInfo = await require("./migration/migrationSource.js").getSource(this.dbInfo.name, this._queryExecutor);
            }
            this._comparisonInfo = this._comparisonInfo || null;
            resolve();
        });
    }

    /** Gets the database generation SQL */
    getSQL() {
        return new db(this.comparisonTarget, this.comparisonSource, this._dropDB).getSQL();
    }

    /** Generates the database's SQL and executes the SQL to create the database. */
    generateDB(debugVal) {
        return new Promise(async (resolve, reject) => {
            await this.updateTargets();
            let creationResult = await this._queryExecutor.execute(this.sql);
            if (migrationSetup.migrationTablesEnabled) {
                let queryDB = this._proxy.queryDB;
                queryDB.migration["+"] = { "migrationState": JSON.stringify(this.dbInfo) };
                await queryDB.save();
            }
            resolve(creationResult);
        });
    }

    /** Gets an array of tables with a specified status. */
    getTablesWithStatus(status) {
        return status === dbStatus.deleted ?
            this.comparisonSource.tableList.filter(x => x.status === status || !status) :
            this.comparisonTarget.tableList.filter(x => x.status === status || !status);
    }

    /** Gets an array of columns with a specified status. */
    getColumnsWithStatus(status) {
        return status === dbStatus.deleted ?
            privateLogic.getColumnsWithStatus.call(this, this.comparisonSource, status) :
            privateLogic.getColumnsWithStatus.call(this, this.comparisonTarget, status);
    }
}


/**
 * privateLogic logic method used in the dbGenerator class
 * @privateLogic
 * @constant
 */
const privateLogic = {
    assignComparisonValues: function () {
        if (!this._comparisonTarget) {
            let result = migrationComparitor.runMigrationComparison(this.comparisonInfo, this.dbInfo);
            this._comparisonTarget = result.target;
            this._comparisonSource = result.source;
        }
    },
    getColumnsWithStatus: function (data, status) {
        return data.tableList.
            reduce((accumulator, table) => {
                table.columnList.forEach(column => {
                    accumulator.push({ table, column });
                });
                return accumulator;
            }, []).
            filter(x => x.status === status || !status);
    }
};

module.exports = dbGenerator;