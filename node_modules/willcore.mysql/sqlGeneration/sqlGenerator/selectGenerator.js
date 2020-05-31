const functionMappings = require("../queries/functionMappings.js")
class selectGenerator{
    /**
     * Gets the select statement for a query
     * @param {Array<Array<String>>} selectStatements 
     */
    static getSQL(selectStatements){
        let selectParts = selectStatements.map(selectArray => {
            if (selectArray.length === 3){
                return `    ${selectArray[1]}.${selectArray[2]} \`${selectArray[0]}\``;
            } else if (selectArray.length === 4){
                return `    ${functionMappings.aggregationFunctions[selectArray[3]](selectArray[1],selectArray[2])} \`${selectArray[0]}\``;
            }
        });
        return `SELECT\n${selectParts.join(",\n")}\n`;
    }
}

module.exports = selectGenerator;