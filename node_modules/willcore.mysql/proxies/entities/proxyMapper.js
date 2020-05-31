const entityProxy = require("./entityProxy.js");
/**
 * Container for the db info classes that have tables mapped to objects.
 */
const dbObjects = {};

class proxyMapper {
    constructor(db) {
        this.db = db;
        this.dbInfo = db._assignable.dbInfo;
    }

    mapValues(values) {
        dbObjects[this.dbInfo.name] = dbObjects[this.dbInfo.name] || this.getDBCopyObj(this.dbInfo);
        let proxyTree = this.buildProxyTree(values);
        return this.normalizeTree(proxyTree);
    }

    normalizeTree(tree) {
        let treeKeys = Object.keys(tree).map(x => x.split(".")).sort((a, b) => a.length - b.length);
        let result = [];
        treeKeys.forEach(keys => {
            let fullKey = keys.join(".");
            if (keys.length === 2) {
                result.push(tree[fullKey]);
            } else {
                let rowObj = tree[fullKey];
                let pathKey = keys.slice(0, keys.length - 2).join(".");
                let property = keys[keys.length - 2];
                let parentObj = tree[pathKey];
                parentObj["_" + property] = parentObj["_" + property] || [];
                if (rowObj[rowObj.$primaryIndicator] !== null){
                    parentObj["_" + property].push(rowObj);
                }
            }
        });
        for (var key in tree) {
            tree[key].$dbInstance = this.db;
        }
        return result;
    }

    buildProxyTree(values) {
        let container = {};
        let dbObj = dbObjects[this.dbInfo.name];
        values.forEach(value => {
            let target = entityProxy.newSubProxy();
            for (let key in value) {
                let keyParts = key.split(".");
                let currentTable = dbObj.tables[keyParts[0]];
                let currentRoute = keyParts[0];
                let primary = this.getTablePrimary(currentTable);
                let currentPath = `${keyParts[0]}.${this.getTablePrimaryValue(currentTable, currentRoute, value, primary)}`;
                container[currentPath] = container[currentPath] || target;
                let currentTarget = container[currentPath];
                currentTarget.$primaryIndicator = primary.name;
                currentTarget.$tableName = currentTable.name;
                for (let treeLevel = 1; treeLevel < keyParts.length - 1; treeLevel++) {
                    currentTable = dbObj.tables[currentTable.columns[keyParts[treeLevel]].reference.table];
                    primary = this.getTablePrimary(currentTable);
                    currentRoute += `.${keyParts[treeLevel]}`;
                    currentPath += `.${keyParts[treeLevel]}.${this.getTablePrimaryValue(currentTable, currentRoute, value, primary)}`;
                    container[currentPath] = container[currentPath] || entityProxy.newSubProxy();
                    currentTarget = container[currentPath];
                    currentTarget.$tableName = currentTable.name;
                    currentTarget.$primaryIndicator = primary.name;
                }
                currentTarget["_" + keyParts[keyParts.length - 1]] = value[key];
            }
        });
        return container;
    }

    getTablePrimaryValue(table, path, value, primary) {
        let primaryColumn = primary || this.getTablePrimary(table);
        let primaryValue = value[`${path}.${primaryColumn.name}`];
        return primaryValue;
    }

    getTablePrimary(table) {
        if (!table) throw `Table ${tableName} not found for proxy mapper.`;
        let result = table.columnList.filter(x => x.primary);
        if (result.length === 0) throw `Table ${tableName} does not have a primary column.`;
        return result[0];
    }


    getDBCopyObj(source, status) {
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

module.exports = proxyMapper;