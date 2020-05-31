const queue = require("./queue.js");


/**
 * Contains and handles the change operations on a database context.
 * Author: Philip Schoeman
 */
class contextStateManager {
    constructor(queryExecutor, type) {
        this.dbType = type;
        this.operations = new queue();
        this.queryExecutor = queryExecutor;
        this.addOperation = require(`./operations/${this.dbType}/addOperation.js`);
        this.updateOperation = require(`./operations/${this.dbType}/updateOperation.js`);
        this.deleteOperation = require(`./operations/${this.dbType}/deleteOperation.js`);
    }

    /**
     * Adds data rows to a table.
     * @param {string} table The table name the data should be added to.
     * @param {Object} rowData And object containing the data that should be written into to the table.
     */
    addRow(table, rowData) {
        this.operations.enqueue(new this.addOperation(table, rowData))
    }

    /**
     * Updates a data row in a table.
     * @param {string} table The name of the table.
     * @param {object} updateValues An object containing the data that should be updated.
     * @param {string} whereField The primary key name of the row.
     * @param {any} whereValue The primary key value of the row.
     */
    updateField(table, updateValues, whereField, whereValue) {
        this.operations.enqueue(new this.updateOperation(table, updateValues, whereField, whereValue));
    }

    /**
     * Deletes a row from a table in the database.
     * @param {String} table The name of the table.
     * @param {String} whereField The name of the primary key.
     * @param {any} whereValue The value of the primary key.
     */
    deleteRow(table, whereField, whereValue) {
        this.operations.enqueue(new this.deleteOperation(table, whereField, whereValue));
    }

    /**
     * Executes all the operations in the statemanager.
     */
    run() {
        return new Promise(async (resolve, reject) => {
            while (!this.operations.isEmpty()) {
                let operation = this.operations.dequeue();
                let toRun = operation.getSQL();
                let result = await this.queryExecutor.runQuery(toRun.sql, toRun.parameter);
                if (result.insertId > 0) {
                    operation.value.id = result.insertId;
                }
            }
            resolve();
        });
    }
}

module.exports = contextStateManager;