/**
 * SQL operation to add an entry to a table.
 */
class deleteOperation {
    constructor(table, whereField, whereValue) {
        this.table = table;
        this.whereField = whereField;
        this.whereValue = whereValue;
    }

    getSQL() {
        return { sql: `DELETE FROM ${this.table} WHERE ${this.whereField} = ?`, parameter: [this.whereValue] };
    }
}

module.exports = deleteOperation;