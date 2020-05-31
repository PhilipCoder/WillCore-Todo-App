class dbInfoQuery {
    static async getDBInfo(mysqlAssignable) {
        return new Promise(async (resolve, reject) => {
            let query = `SELECT 
                            col.TABLE_NAME tableName,
                            col.COLUMN_NAME columnName,
                            col.ORDINAL_POSITION columnIndex,
                            DATA_TYPE dataType,
                            CHARACTER_MAXIMUM_LENGTH minLength,
                            NUMERIC_PRECISION numericPrecision,
                            NUMERIC_SCALE numericScale,
                            DATETIME_PRECISION dateTimePrecision,
                            COLUMN_TYPE columnTYpe,
                            COLUMN_KEY columnKey
                        FROM
                            information_schema.columns col
                                INNER JOIN
                            information_schema.tables tab
                                ON
                            col.TABLE_NAME = tab.TABLE_NAME
                        WHERE
                            col.TABLE_SCHEMA = '${mysqlAssignable.dbInfo.name}'`;

            let dbInfoQueryResult = await mysqlAssignable.queryExecutor.execute(query);
            let result = {
                name: mysqlAssignable.dbInfo.name,
                tables: {}
            };
            dbInfoQueryResult.forEach(row => {
                if (!result.tables[row.tableName]) {
                    result.tables[row.tableName] = {
                        name: row.tableName,
                        columns: {}
                    };
                }
                result.tables[row.tableName].columns[row.columnName] = {
                    columnName: row.columnName,
                    columnIndex: row.columnIndex,
                    dataType: row.dataType,
                    minLength: row.minLength,
                    numericPrecision: row.numericPrecision,
                    numericScale: row.numericScale,
                    dateTimePrecision: row.dateTimePrecision,
                    columnType: row.columnTYpe,
                    columnKey: row.columnKey
                };
            });
            resolve(result);
        });
    }
}

module.exports = dbInfoQuery;