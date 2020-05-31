const functionMappings = require("../queries/functionMappings.js");

/**
 * Final stage SQL generation, converts queryNodes into a SQL where expression.
 * 
 * Author: Philip Schoeman
 */
class whereGenerator {
    /**
     * Gets the SQL for the where clause of a query.
     * @param {ArrayLike<Object>} queryNodes 
     */
    static getSQL(queryNodes) {
        if (queryNodes.length === 0) return "";
        let result = '\nWHERE';
        for (let nodeI = 0; nodeI < queryNodes.length; nodeI++) {
            let queryNode = queryNodes[nodeI];
            switch (queryNode.type) {
                case "function":
                    switch (queryNode.functionType) {
                        case "queryValuesFunction":
                            result += " " + functionMappings[queryNode.functionType + "s"][queryNode.function](whereGenerator.getFunctionParameter(queryNodes[nodeI - 1]), whereGenerator.getFunctionParameter(queryNodes[nodeI + 1]));
                            nodeI += 1;
                            break;
                        case "queryColumnFunction":
                            result += " " + functionMappings[queryNode.functionType + "s"][queryNode.function](whereGenerator.getFunctionParameter(queryNodes[nodeI - 1]), whereGenerator.getFunctionParameter(queryNodes[nodeI + 1]));
                            nodeI += 1;
                            break;
                        case "aggregationFunctions":
                            result += " " + functionMappings[queryNode.functionType + "s"][queryNode.function](queryNodes[nodeI - 1].alias, queryNodes[nodeI - 1].column);
                            break;
                        case "queryValueFunctions":
                            result += " " + functionMappings[queryNode.functionType + "s"][queryNode.function](whereGenerator.getFunctionParameter(queryNodes[nodeI + 1]));
                            nodeI += 1;
                            break;
                        case "queryFunctions":
                            result += " " + functionMappings[queryNode.functionType + "s"][queryNode.function](queryNodes[nodeI - 1].alias, queryNodes[nodeI - 1].column);
                            break;
                        case "statements":
                            result += " " + functionMappings[queryNode.functionType + "s"][queryNode.function]();
                            break;
                    }
                    break;
                case "litteral":
                    result += whereGenerator.getFunctionParameter(queryNode);
                    break;
                default:
                    switch (queryNode) {
                        case "&&":
                            result += " AND";
                            break;
                        case "||":
                            result += " OR";
                            break;
                        case "(":
                            result += " (";
                            break;
                        case ")":
                            result += " )";
                            break;
                    }
                    break;
            }
        }
        return result;
    }

    static getFunctionParameter(queryNode) {
        switch (queryNode.type) {
            case "tableColumn":
                return `${queryNode.alias}.${queryNode.column}`;
            case "litteral":
                if (queryNode.value.startsWith && queryNode.value.startsWith("\"")) {
                    return whereGenerator.replaceAll(queryNode.value, "\"", "'");
                }
                return queryNode.value;
            default:
                throw "No supported function";
        }
    }

    static replaceAll(str, toReplace, replaceWith) {
        while (str.indexOf(toReplace) > -1) {
            str = str.replace(toReplace, replaceWith);
        }
        return str;
    }
}

module.exports = whereGenerator;