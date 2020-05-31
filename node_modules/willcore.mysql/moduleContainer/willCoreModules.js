module.exports = (willCoreModuleInstance) => {
    willCoreModuleInstance.mysql = () => require("../assignables/mysql/mysql.js");
    willCoreModuleInstance.table = () => require("../assignables/mysql/table/dbTable.js");
    willCoreModuleInstance.column = () => require("../assignables/mysql/column/dbColumn.js");
    willCoreModuleInstance.reference = () => require("../assignables/mysql/reference/reference.js");
};