const mysql = require("mysql2");

class runQuery {
    constructor(connectionString, userName, password,dbName) {
        this.connectionString = connectionString;
        this.userName = userName;
        this.password = password;
        this.promisePool = null;
        this.connection = null;
        this.initDB(connectionString, userName, password, dbName);
    }

    initDB(connection, userName, password,dbName) {
        this.connectionString = connection;
        this.userName = userName;
        this.password = password;
        this.dbname = dbName;
        return new Promise((resolve, reject) => {
            
            resolve();
        });
    }

    execute(sql) {
        return new Promise((resolve, reject) => {
            this.connection = mysql.createConnection({
                host:  this.connectionString,
                user: this.userName,
                password: this.password,
                multipleStatements: true,
                flags: '-CONNECT_WITH_DB,IGNORE_SPACE'
            });
            this.connection.connect((err) => {
                if (err) {
                    reject(err);
                } else {
                    this.connection.query(sql, (err, result) => {
                        this.connection.end();
                        if (err) { 
                            reject(err); 
                        }
                        else { 
                            resolve(result); 
                        }
                    });
                }
            });;
        });
    }

    runQuery(sql,parameters) {
        return new Promise((resolve, reject) => {
            let connection = mysql.createConnection({
                host: this.connectionString,
                user: this.userName,
                password: this.password,
                database:this.dbname,
                multipleStatements: true,
                flags: 'IGNORE_SPACE'
            });
            connection.connect((err) => {
                if (err) {
                    reject(err);
                } else {
                    connection.query(sql, parameters, (err, result) => {
                        connection.end();
                        if (err) { reject(err); }
                        else { resolve(result); }
                    });
                }
            });;
        });
    }
}

module.exports = runQuery;