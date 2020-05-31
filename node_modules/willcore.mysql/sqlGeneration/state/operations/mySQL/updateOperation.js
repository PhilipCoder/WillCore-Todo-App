/**
 * SQL operation to add an entry to a table.
 */
class updateOperation {
    constructor(table, updateValues, whereField, whereValue) {
        this.updateValues = updateValues;
        this.table = table;
        this.whereField = whereField;
        this.whereValue = whereValue;
    }

    getSQL() {
        let updateFields = Object.keys(this.updateValues);
        let updatePart = updateFields.map(field=>` ${field} = ?`).join(",");
        let updateValues = updateFields.map(field=>this.updateValues[field]);
        return { sql: `UPDATE ${this.table} SET${updatePart} WHERE ${this.whereField} = ?`, parameter: [...updateValues, this.whereValue] };
    }
}

module.exports = updateOperation;