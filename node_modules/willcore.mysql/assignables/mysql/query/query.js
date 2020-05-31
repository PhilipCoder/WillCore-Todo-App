const esprima = require('esprima');
const escodegen = require("escodegen");

class query{
    constructor(db, tableName){
        this.run = function(){};
    }

    select(selectFunc){
        let selectExpression = esprima.parseScript(selectFunc.toString());
        if (validateSelectExpression(selectExpression)){
            let expressionString = escodegen.generate(selectExpression.body[0].expression.body);
            selectExpression = esprima.tokenize(expressionString);
        }else{
            throw "Invalid argument passed to the query select statement. The select statement should be an arrow function returning an object with the fields selected.";
        }
        this.run.selectExpression = selectExpression;
        return this.run;

        function validateSelectExpression(selectExpression){
            return selectExpression.body && 
            selectExpression.body.length > 0 && 
            selectExpression.body[0].type === "ExpressionStatement" && 
            selectExpression.body[0].expression.type === "ArrowFunctionExpression" &&
            selectExpression.body[0].expression.body.type === "ObjectExpression";
        }
    }

    filter(filterFunc){
        let filterExpression = esprima.parseScript(filterFunc.toString());
        if (validateFilterExpression(filterExpression)){
            filterExpression = filterExpression.body[0].expression.body;
            let expressionString = escodegen.generate(filterExpression);
            filterExpression = esprima.tokenize(expressionString);
            this.run.filterExpression = filterExpression;
        }else{
            throw "Invalid argument passed to the query select statement. The select statement should be an arrow function returning an object with the fields selected.";
        }
        function validateFilterExpression(selectExpression){
            return selectExpression.body && 
            selectExpression.body.length > 0 && 
            selectExpression.body[0].type === "ExpressionStatement" && 
            selectExpression.body[0].expression.type === "ArrowFunctionExpression" &&
            selectExpression.body[0].expression.body.type === "LogicalExpression";
        }
    }
}

module.exports = query;