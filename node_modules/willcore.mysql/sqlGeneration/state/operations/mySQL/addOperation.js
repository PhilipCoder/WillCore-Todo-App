/**
 * SQL operation to add an entry to a table.
 */
class addOperation {
    constructor(table, value) {
        this.value = value;
        this.table = table;
    }

    getSQL() {
        return { sql: `INSERT INTO ${this.table} SET ? `, parameter: this.value };
    }
}

module.exports = addOperation;