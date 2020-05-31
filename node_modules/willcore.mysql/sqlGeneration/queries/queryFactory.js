const queryAble = require("../queries/queryable.js")
const query = require("../../sqlGeneration/queries/queryGenerator.js");
const selectGenerator = require("../../sqlGeneration/sqlGenerator/selectGenerator.js");
const joinGenerator = require("../../sqlGeneration/sqlGenerator/joinGenerator.js");
const whereGenerator = require("../../sqlGeneration/sqlGenerator/whereGenerator.js");
const orderByGenerator = require("../../sqlGeneration/sqlGenerator/orderByGenerator.js");
const limitGenerator = require("../../sqlGeneration/sqlGenerator/limitGenerator.js");

const entityMapper = require("../../proxies/entities/proxyMapper.js");

class queryFactory {
    constructor(db, table) {
        this.db = db;
        this.table = table;
    }
    getQuery() {
        this.generator = new (require("../dbGenerator.js"))(this.db);
        this.generator.dropDB = true;
        this.dbInfo = this.generator.comparisonTarget;
        this.runQuery.bind(this);
        this.queryAble = queryAble.get(this.dbInfo, this.table, this);
        this.queryAble.runFunc = this.runQuery;
        return this.queryAble;
    }
    getCalculationValues() {
        let queryValues = this.queryAble.getValues();
        let selectQuery = new query(this.dbInfo, this.table);
        let joinObj = selectQuery.getJoinObj(queryValues.select.selectParts, queryValues.filter.parts);
        let joinTree = selectQuery.getJoinTree(joinObj);
        this.calulationValues = {
            joinTree: joinTree,
            selects: joinObj.selects,
            tableAliases: joinObj.tableAliases,
            queryNodes: joinObj.queryNodes
        };
        return this.calulationValues;
    }
    getSQL() {
        let queryValues = this.queryAble.getValues();
        let calculationValues = this.getCalculationValues();
        let selectSQL = selectGenerator.getSQL(calculationValues.selects);
        let joinSQL = joinGenerator.getSQL(calculationValues.joinTree);
        let whereSQL = whereGenerator.getSQL(calculationValues.queryNodes);
        let orderBySQL = orderByGenerator.getSQL(queryValues.sort);
        let limitSQL = limitGenerator.getSQL(queryValues.take);
        let fullSQL = selectSQL + joinSQL + whereSQL + orderBySQL + limitSQL;
        return fullSQL;
    }
    runQuery(querySQL, queryParameters) {
        return new Promise(async (resolve, reject) => {
            let parameters = queryParameters || this.queryAble.getValues().filter.parameters;
            let sql = querySQL || this.getSQL();
            let results = await this.db._assignable.queryExecutor.runQuery(sql, parameters);
            resolve(new entityMapper(this.db).mapValues(results));
        });
    }
}

module.exports = queryFactory;