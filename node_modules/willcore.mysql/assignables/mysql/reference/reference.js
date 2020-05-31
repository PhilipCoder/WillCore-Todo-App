const assignable = require("willcore.core/assignable/assignable");
const dbColumnProxy = require("../column/dbColumnProxy.js");

class reference extends assignable {
    constructor() {
        super({ object: 1 }, dbColumnProxy);
    }

    completionResult() {
    }

    completed() {
        let multi = this.propertyName;
        if (multi !== "one_one" && multi !== "one_many" && multi !== "many_many" && multi !== "many_one") {
            throw "Invalid reference multiplication.";
        }
        let target = this.bindedValues.object[0];
        let targetColumnName = target._assignable.columnInfo.name;
        let targetTableName = target._assignable.parentProxy._assignable.tableInfo.name;

        let sourceColumnName = this.parentProxy._assignable.columnInfo.name;
        let sourceTableName = this.parentProxy._assignable.parentProxy._assignable.tableInfo.name;

        multi = multi.split("_");

        target._assignable.columnInfo.reference = {
            table: sourceTableName,
            column: sourceColumnName,
            multiplication: multi[1]
        };

        this.parentProxy._assignable.columnInfo.reference = {
            table: targetTableName,
            column: targetColumnName,
            multiplication: multi[0]
        };
    }
}

module.exports = reference;