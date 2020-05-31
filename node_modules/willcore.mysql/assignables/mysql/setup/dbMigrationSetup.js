let addMigrationSetup = true;
class dbMigrationSetup {
    static setupTables(proxy, dbName) {
        if (addMigrationSetup) {
            proxy.migration.table;
            proxy.migration.id.column.int;
            proxy.migration.id.primary;
            proxy.migration.migrationState.column.text;
            proxy.migration.migrationState.size = 16000;
        }
    }
    static set migrationTablesEnabled(value){
        addMigrationSetup = value;
    }
    static get migrationTablesEnabled(){
        return addMigrationSetup;
    }
};

module.exports = dbMigrationSetup;