const mysql = require("../mysql.js");


class statefullDB extends mysql{
    /**
     * @param {mysql} mysql 
     */
    constructor(mysql){
        super();
        this.dbInfo = mysql.dbInfo;
        this.dbGenerator = mysql.dbGenerator;
        this.queryExecutor = mysql.queryExecutor;
        this.contextStateManager = new contextStateManager(this.queryExecutor,this.hiddenVariables._assignable.type);
    }
}

module.exports = statefullDB;