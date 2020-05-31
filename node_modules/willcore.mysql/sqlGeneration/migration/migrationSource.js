

class migrationSource {
    static getSource(dbName, queryExecutor) {
        return new Promise(async (resolve, reject) => {
            let dbExistsSQL = `SET @dbExists =  EXISTS( SELECT SCHEMA_NAME
                                    FROM INFORMATION_SCHEMA.SCHEMATA
                                WHERE SCHEMA_NAME = '${dbName}'); 
                                
                                SELECT @dbExists dbExists`;

            let dbExistsResult = await queryExecutor.execute(dbExistsSQL);
            if (dbExistsResult[1][0].dbExists) {
                let dbMigrationSource = ` SELECT 
                                            migrationState 
                                            FROM 
                                                ${dbName}.migration 
                                            ORDER BY ID DESC 
                                            LIMIT 1;`;
                let migrationSourceResult = await queryExecutor.runQuery(dbMigrationSource, []);
                resolve(JSON.parse(migrationSourceResult[0].migrationState))
            } else {
                resolve(null);
            }
        });
    }
}

module.exports = migrationSource;