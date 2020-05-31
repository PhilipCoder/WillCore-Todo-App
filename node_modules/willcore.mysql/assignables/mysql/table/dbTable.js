const assignable = require("willcore.core/assignable/assignable");
const mysqlProxy = require("../db/mysqlProxy.js");
const dbTableProxy = require("./dbTableProxy.js");

class dbTable extends assignable {
    constructor() {
        super({ }, mysqlProxy);
        this.tableInfo = {
            name: null,
            columns:[]
        };
    }

    completionResult() {
        var result = dbTableProxy.new(this);
        result._parent = this.parentProxy._parent;
        return result;
    }

    completed() {
        this.tableInfo.name = this.propertyName;
        this.parentProxy._assignable.dbInfo.tables.push(this.tableInfo);
    }
}

module.exports = dbTable;