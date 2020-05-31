const keywords = {
    createDB: {
        createComment: "-- DB does not exists, creating DB.",
        createStatement: "CREATE DATABASE",
        useStatement: "USE"
    },
    createTable: {
        createComment: "-- Create table.",
        createStatement: "CREATE TABLE",
        engineStatement: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci"
    },
    createColumn: {
        primaryKey: "AUTO_INCREMENT PRIMARY KEY",
        foreignKey: "FOREIGN KEY",
        reference: "REFERENCES",
        keyDelete: "ON DELETE CASCADE",
        index: "INDEX"

    },
    alterTable: {
        alterTable: "ALTER TABLE",
        addColumn: "ADD COLUMN",
        add: "ADD",
        dropColumn: "DROP COLUMN",
        dropTable: "DROP TABLE",
        dropForeignKey: "DROP FOREIGN KEY",
        constraint:"CONSTRAINT"
    }
};

const typeMappings = {
    int: {
        dbType: "int",
        resizeAble: true,
        defaultSize: null
    }, smallInt: {
        dbType: "smallint",
        resizeAble: false,
        defaultSize: null
    }, tinyInt: {
        dbType: "tinyint",
        resizeAble: false,
        defaultSize: null
    }, bigInt: {
        dbType: "bigint",
        resizeAble: false,
        defaultSize: null
    }
    , string: {
        dbType: "varchar",
        resizeAble: true,
        defaultSize: 256
    }, nstring: {
        dbType: "nvarchar",
        resizeAble: true,
        defaultSize: 256
    }, decimal: {
        dbType: "decimal",
        resizeAble: true,
        defaultSize: [20, 7]
    }, float: {
        dbType: "float",
        resizeAble: true,
        defaultSize: [20, 7]
    }, date: {
        dbType: "datetime",
        resizeAble: true,
        defaultSize: 6
    }, bool: {
        dbType: "boolean",
        resizeAble: false
    }, text: {
        dbType: "text",
        resizeAble: false
    }

};

exports.keywords = keywords;
exports.typeMappings = typeMappings;
