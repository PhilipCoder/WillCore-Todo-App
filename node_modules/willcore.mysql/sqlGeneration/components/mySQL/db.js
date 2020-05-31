const keywords = require("./mySQLConstants.js").keywords;
const table = require("./table.js");
const status = require("../../migration/statusEnum.js");

class db {
    constructor(dbInfo, sourceDBInfo, dropDB) {
        this.dbInfo = dbInfo;
        this.sourceDBInfo = sourceDBInfo;
        this.dropDB = dropDB;
    }
    getSQL() {
        let result =  this.dropDB ? `DROP DATABASE IF EXISTS ${this.dbInfo.name};\n` : "";
        if (this.dbInfo.status !== status.skip) {
            result += `${keywords.createDB.createComment}\n${keywords.createDB.createStatement} ${this.dbInfo.name};\n`;
        }
        result += `${keywords.createDB.useStatement} ${this.dbInfo.name};`;
        result += (this.sourceDBInfo ? this.getDeleteSQL() : "");
        let tables = this.dbInfo.tableList || this.dbInfo.tables;
        if (tables.length > 0) {
            result = result + tables.filter(x => x.status !== status.skip).map(x => new table(x).getSQL()).join("\n");
        }
        return result;
    }

    getDeleteSQL() {
        let result = "";
        if (this.getDeletedColumns().length > 0) {
            result = `\n-- Delete columns\n${this.getDropFKDeletedColumns().join('\n')}\n${this.getDeleteColumnSQL().join('\n')}\n`;
        }
        if (this.getDeletedTables().length > 0) {
            result += `-- Delete tables\n${this.getDropFKDeletedTables().join('\n')}\n${this.getDeleteTableSQL().join('\n')}\n`;
        }
        return result;
    }

    getDropFKDeletedColumns() {
        let result = [];
        this.getDeletedColumns().forEach(item => {
            let columnFKs = this.getForeignKeysForColumn(item.table.name, item.column.name);
            columnFKs.forEach(columnFK => {
                result.push(`${keywords.alterTable.alterTable} ${item.table.name} ${keywords.alterTable.dropForeignKey} \`${columnFK.key}\`;`);
            });
        });
        return result;
    }

    getDropFKDeletedTables() {
        let result = [];
        this.getDeletedTables().forEach(table => {
            let tableFKs = this.getForeignKeysForTable(table.name);
            tableFKs.forEach(tableFk => {
                result.push(`${keywords.alterTable.alterTable} ${table.name} ${keywords.alterTable.dropForeignKey} \`${tableFk.key}\`;`);
            });
        });
        return result;
    }

    getDeleteColumnSQL() {
        return this.getDeletedColumns().map(item => `${keywords.alterTable.alterTable} ${item.table.name} ${keywords.alterTable.dropColumn} ${item.column.name};`);
    }

    getDeleteTableSQL() {
        return this.getDeletedTables().map(table => `${keywords.alterTable.dropTable} ${table.name};`);
    }

    getDeletedTables() {
        let result = [];
        this.sourceDBInfo.tableList.forEach(table => {
            if (table.status === status.deleted) {
                result.push(table);
            }
        });
        return result;
    }

    getDeletedColumns() {
        let result = [];
        this.sourceDBInfo.tableList.forEach(table => {
            table.columnList.forEach(column => {
                let isPrimary = !column.reference ||
                !this.sourceDBInfo.tables[column.reference.table].columns[column.reference.column].reference;
                if (column.status === status.deleted && isPrimary) {
                    result.push({ column, table });
                }
            });
        });
        return result;
    }

    getForeignKeysForTable(tableName) {
        let foreignKeys = [];
        this.sourceDBInfo.tables[tableName].columnList.forEach(column => {
            this.getForeignKeysForColumn(tableName, column.name).forEach(key => {
                foreignKeys.push(key);
            });
        });
        return foreignKeys;
    }

    getForeignKeysForColumn(tableName, columnName) {
        let foreignKeys = [];
        let currentColumn = this.sourceDBInfo.tables[tableName].columns[columnName];
        if (currentColumn.reference) {
            foreignKeys.push({ table: tableName, key: this.getForeignKeyName(tableName, columnName, currentColumn.reference.table, currentColumn.reference.column) });
            return foreignKeys;
        }
        this.sourceDBInfo.tableList.forEach(table => {
            table.columnList.forEach(column => {
                if (column.reference && column.reference.table === tableName && column.reference.column === columnName) {
                    foreignKeys.push({ table: table.name, key: this.getForeignKeyName(table.name, column.name, column.reference.table, column.reference.column) });
                }
            });
        });
        return foreignKeys;
    }

    getForeignKeyName(tableName, columnName, targetTable, targetColumn) {
        let targetColumnObj = this.sourceDBInfo.tables[targetTable].columns[targetColumn];
        if (targetColumnObj.reference){
            tableName = targetTable;
            columnName = targetColumn;
            targetTable = targetColumnObj.reference.table;
            targetColumn = targetColumnObj.reference.column;
        }
        return `fk_${tableName}_${columnName}_${targetTable}_${targetColumn}`;
    }

}

module.exports = db;