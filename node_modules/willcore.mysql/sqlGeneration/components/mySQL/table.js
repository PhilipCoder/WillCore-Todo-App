const keywords = require("./mySQLConstants.js").keywords;
const column = require("./column.js");
const status = require("../../migration/statusEnum.js");

class table {
    constructor(tableInfo) {
        this.tableInfo = tableInfo;
    }
    getSQL() {
        let columnList = this.tableInfo.columnList || this.tableInfo.columns;
        if ((!this.tableInfo.status || this.tableInfo.status === status.new) && columnList.length > 0) {
            let columnsString = columnList.filter(x=>!(x.reference && x.reference.primary === false)).map(x => new column(x).getSQL()).join(",\n");
            return `\n${keywords.createTable.createComment}\n${keywords.createTable.createStatement} \`${this.tableInfo.name}\` (\n${columnsString}\n) ${keywords.createTable.engineStatement};`;
        }
        else if (this.tableInfo.status === status.modified ) {
            let result = '\n';
            result = this.calculateNewColumnsSQL(columnList, result);
            return result;
        }
        else {
            return '';
        }
    }

    calculateNewColumnsSQL(columnList, result) {
        let newColumns = columnList.filter(x => (x.status === status.new || x.status === status.addReference) && !(x.reference && x.reference.primary === false));
        if (newColumns.length > 0) {
            result += `${keywords.alterTable.alterTable} ${this.tableInfo.name}\n`;
            let columnsString = newColumns.map(x => new column(x).getSQL(true)).join(",\n");
            result += `${columnsString};`;
        }
        return result;
    }

    calculateAddFKSQL(columnList, result) {
        let newColumns = columnList.filter(x => x.status === status.addReference && !(x.reference && x.reference.primary === false));
        if (newColumns.length > 0) {
            result += `${keywords.alterTable.alterTable} ${this.tableInfo.name}\n`;
            let columnsString = newColumns.map(x => `${keywords.alterTable.addColumn} ${new column(x).getSQL()}`).join(",\n");
            result += `${columnsString};`;
        }
        return result;
    }

   
}

module.exports = table;