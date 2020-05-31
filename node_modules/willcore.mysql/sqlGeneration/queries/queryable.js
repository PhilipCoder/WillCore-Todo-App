const chainableProxy = require("willcore.core/proxies/chainable/chainableProxyHandler.js");
const query = require("../../sqlGeneration/queries/queryGenerator.js");
const preProcessor = require("./tokenPreProcessor.js");

class queryFactory {
    static get(dbConfig, tableName, queryFactory) {
        let scopedVariables = {
            dbConfig: dbConfig,
            tableName: tableName,
            includes: {

            },
            filter: {
                filterExpression: null,
                parameters: null,
                queryScope: null,
                parameterIndexes: null
            },
            select: {
                selectObj: null
            },
            sort: {
                descending: null,
                sortFunc: null
            },
            take: {
                takeCount: null,
                skipCount: null
            }
        };
        /**
         * Query. Executes a query.
         */
        const queryable = function () {
            queryFactory.runQuery.bind(queryFactory);
            return queryFactory.runQuery();
        };

        /**
         * Saves a query for reuse.
         * Query name should be unique to the table and should start with an underscore.
         */
        queryable.save = function (name) {
            if (!name.startsWith("_")) throw `Invalid query name: ${name}. Query names should start with an underscore, "_".`;
            queryFactory.runQuery.bind(queryFactory);
            let sql = queryFactory.getSQL();
            queryFactory.db[scopedVariables.tableName][name] = function (parameters) {
                queryFactory.runQuery.bind(queryFactory);
                return queryFactory.runQuery(sql, scopedVariables.filter.parameterIndexes.map(x => parameters[x]));
            };
        }

        /**
         * Adds a filter clause to a SQL query.
         */
        queryable.filter = function (filterExpression, queryScope) {
            let queryArrowFunction = filterExpression.toString();
            if (queryArrowFunction.indexOf("(") === -1 || queryArrowFunction.indexOf(")") === -1 || queryArrowFunction.indexOf("=>") === -1) throw "Invalid arrow function used for filter query."
            let filterArrowParameterName = queryArrowFunction.substring(queryArrowFunction.indexOf("(") + 1, queryArrowFunction.indexOf(")") - (queryArrowFunction.lastIndexOf("(")));
            filterArrowParameterName = filterArrowParameterName.trim();
            if (filterArrowParameterName !== scopedVariables.tableName) {
                if (!filterArrowParameterName || filterArrowParameterName.indexOf(" ") > -1 || filterArrowParameterName.indexOf(",") > -1) throw "Invalid filter function parameter.";
                queryArrowFunction = queryArrowFunction.split(`${filterArrowParameterName}.`).join(`${scopedVariables.tableName}.`);
            }
            queryScope = queryScope || {};
            scopedVariables.filter.filterExpression = filterExpression;
            scopedVariables.filter.queryScope = queryScope;
            let selectQuery = new query();
            let filterValues = selectQuery.filter(queryArrowFunction, queryScope);
            scopedVariables.filter.parts = filterValues.nodes;
            scopedVariables.filter.parameters = filterValues.parameters;
            scopedVariables.filter.parameterIndexes = filterValues.parameterIndexes;
            scopedVariables.filter.parts = new preProcessor().process(scopedVariables.filter.parts);
            return queryable;
        };

        /** 
         * Adds a select clause to a SQL query.
        */
        queryable.select = function (selectFunc) {
            scopedVariables.select.selectObj = selectFunc;
            scopedVariables.select.selectParts = scopedVariables.select.selectParts || {};
            let selectObj = selectFunc(chainableProxy.new(scopedVariables.tableName));
            for (let key in selectObj) {
                scopedVariables.select.selectParts[key] = selectObj[key]._name;
            }
            return queryable;
        };

        /**
         * Adds a table to the result of a query.
         */
        queryable.include = function (tableLinkedProxy) {
            if (typeof tableLinkedProxy !== "function") throw "Queryable include function expected a parameter of type function.";
            let proxyChain = chainableProxy.new(scopedVariables.tableName);
            let names = tableLinkedProxy(proxyChain)._name;
            let includeValue = names.join(".");
            scopedVariables.includes[includeValue] = true;
            if (names.length > 0) {
                let table = scopedVariables.dbConfig.tables[names[0]];
                if (!table) throw `Table ${names[0]} does not exist.`;
                for (let nameI = 1; nameI < names.length; nameI++) {
                    let column = table.columns[names[nameI]];
                    if (!column) throw `Table ${table.name} does not have a column ${names[nameI]}.`;
                    if (!column.reference) throw `Column ${names[nameI]} on table ${table.name} does not reference another table.`;
                    table = scopedVariables.dbConfig.tables[column.reference.table];
                    if (!table) throw `Table ${names[nameI]} does not exist.`;
                }
                scopedVariables.select.selectParts = scopedVariables.select.selectParts || {};
                Object.keys(table.columns).map(colName => `${includeValue}.${table.columns[colName].name}`).forEach(key => {
                    scopedVariables.select.selectParts[key] = key.split(".");
                });
            }
            return queryable;
        };

        /**
         * Adds a sort clause to a SQL query
         */
        queryable.sort = function (sortFunc, descending) {
            scopedVariables.sort.descending = descending;
            scopedVariables.sort.sortFunc = sortFunc;
            scopedVariables.sort.sortParts = sortFunc(chainableProxy.new(scopedVariables.tableName))._name;
            return queryable;
        };

        /**
         * Adds a take clause a SQL query
         */
        queryable.take = function (takeCount) {
            scopedVariables.take.takeCount = takeCount;
            return queryable;
        };

        /**
         * Adds a skip clause a SQL query
         */
        queryable.skip = function (skipCount) {
            scopedVariables.take.skipCount = skipCount;
            return queryable;
        };

        /**
         * Gets the SQL of the query
         */
        queryable.toString = function () {
            return "aa";
        }

        queryable.getValues = function () {
            return scopedVariables;
        }

        if (dbConfig.tables) {
            queryable.include((table) => table);
        }
        return queryable;
    }
}
module.exports = queryFactory;