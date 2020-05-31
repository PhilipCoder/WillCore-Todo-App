const dbStatus = require("./statusEnum.js");
/**
 * Compares two database objects to find the differences.
 */
class migrationComparitor {
    /**
     * Run a migration comparison between two database configuration objects.
     * @param {object} source The source database configuration object. This is usually stored in SQL
     * @param {object} target The target database configuration object. This is generated via proxies.
     */
    static runMigrationComparison(source, target) {
        if (source && source.name && source.name !== target.name) return "DB names does not match.";

        if (!source) return { target: migrationComparitor.getDBCopyObj(target, dbStatus.new) };

        let sourceDBTables = migrationComparitor.getDBCopyObj(source);
        let targetDBTables = migrationComparitor.getDBCopyObj(target);

        targetDBTables.status = dbStatus.skip;

        migrationComparitor.handleNewAndModifiedItems(targetDBTables, sourceDBTables);
        migrationComparitor.handleDeletedItems(sourceDBTables, targetDBTables);
        return { source: sourceDBTables, target: targetDBTables };
    };

    /**
     * @private
     */
    static handleNewAndModifiedItems(targetDBTables, sourceDBTables) {
        targetDBTables.tableList.forEach(currentTargetTable => {
            let currentSourceTable = sourceDBTables.tables[currentTargetTable.name];
            if (!currentSourceTable) {
                migrationComparitor.handleNewTable(currentTargetTable);
            }
            else {
                migrationComparitor.handleModifiedTable(currentTargetTable, currentSourceTable);
            }
        });
    }

    /**
     * @private
     */
    static handleNewTable(currentTargetTable) {
        currentTargetTable.status = dbStatus.new;
        currentTargetTable.columnList.forEach(targetColumn => { targetColumn.status = dbStatus.new; });
    }

    /**
     * @private
     */
    static handleModifiedTable(currentTargetTable, currentSourceTable) {
        let modifiedColumnCounter = 0;
        currentTargetTable.columnList.forEach(targetColumn => {
            modifiedColumnCounter = migrationComparitor.processColumn(currentSourceTable, targetColumn, modifiedColumnCounter);
        });
        currentTargetTable.status = modifiedColumnCounter === 0 ? dbStatus.skip : dbStatus.modified;
    }

    /**
     * @private
     */
    static handleDeletedItems(sourceDBTables, targetDBTables) {
        sourceDBTables.tableList.forEach(currentSourceTable => {
            let currentTargetTable = targetDBTables.tables[currentSourceTable.name];
            if (!currentTargetTable) {
                currentSourceTable.status = dbStatus.deleted;
            }
            else {
                currentSourceTable.columnList.forEach(sourceColumn => {
                    let targetColumn = currentTargetTable.columns[sourceColumn.name];
                    if (!targetColumn) {
                        sourceColumn.status = dbStatus.deleted;
                    }
                });
            }
        });
    }

    /**
     * @private
     */
    static processColumn(currentSourceTable, targetColumn, modifiedColumnCounter) {
        let sourceColumn = currentSourceTable.columns[targetColumn.name];
        if (!sourceColumn) {
            modifiedColumnCounter++;
            targetColumn.status = dbStatus.new;
        }
        else {
            modifiedColumnCounter = migrationComparitor.processChangedColumns(sourceColumn, targetColumn, modifiedColumnCounter);
        }
        return modifiedColumnCounter;
    }

    /**
     * @private
     */
    static processChangedColumns(sourceColumn, targetColumn, modifiedColumnCounter) {
        if (sourceColumn.type !== targetColumn.type ||
            (Array.isArray(targetColumn.size) && targetColumn.size.filter((x, i) => targetColumn.size[i] !== sourceColumn.size[i]).length !== 0) ||
            (!Array.isArray(targetColumn.size) && targetColumn.size !== sourceColumn.size)) {
            modifiedColumnCounter++;
            targetColumn.status = dbStatus.typeChanged;
        }
        else if (targetColumn.reference && !sourceColumn.reference) {
            modifiedColumnCounter++;
            targetColumn.status = dbStatus.addReference;
        }
        else if (!targetColumn.reference && sourceColumn.reference) {
            modifiedColumnCounter++;
            targetColumn.status = dbStatus.removeReference;
        }
        else if (targetColumn.reference && sourceColumn.reference && (sourceColumn.reference.column !== targetColumn.reference.column || sourceColumn.reference.table !== targetColumn.reference.table)) {
            modifiedColumnCounter++;
            targetColumn.status = dbStatus.changeReference;
        }
        else {
            targetColumn.status = dbStatus.skip;
        }
        return modifiedColumnCounter;
    }

    static getDBCopyObj(source, status) {
        let dbInfo = {};
        Object.assign(dbInfo, source);
        dbInfo.tables = {};
        dbInfo.tableList = [];
        if (status) {
            dbInfo.status = status;
        }
        source.tables.forEach(t => {
            let sourceTable = {};
            Object.assign(sourceTable, t);
            sourceTable.columns = {};
            if (status) {
                sourceTable.status = status;
            }
            sourceTable.columnList = [];
            t.columns.forEach(c => {
                let sourceColumn = {};
                Object.assign(sourceColumn, c);
                sourceTable.columns[c.name] = sourceColumn;
                if (status) {
                    sourceColumn.status = status;
                }
                sourceTable.columnList.push(sourceColumn);
            });
            dbInfo.tables[t.name] = sourceTable;
            dbInfo.tableList.push(sourceTable);
        });
        return dbInfo;
    }
}

module.exports = migrationComparitor;