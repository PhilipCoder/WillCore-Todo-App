const assignable = require("willcore.core/assignable/assignable");
const dbTableProxy = require("../table/dbTableProxy.js");
const dbColumnProxy = require("./dbColumnProxy.js");

class dbColumn extends assignable {
    constructor() {
        super({ string: 1 }, dbTableProxy);
        this.columnInfo = {
            name: null,
            type: null
        };
    }

    completionResult() {
        let result = dbColumnProxy.new(this);
        result._parent = this.parentProxy._parent;
        return result;
    }

    completed() {
        this.columnInfo.name = this.propertyName;
        this.columnInfo.type = this.bindedValues.string[0];
        this.parentProxy._assignable.tableInfo.columns.push(this.columnInfo);
    }
}

module.exports = dbColumn;