/**
 * Final stage SQL generation module that generates the joins between tables in a select query.
 * 
 * Author: Philip Schoeman
 */
class joinGenerator {
    static getSQL(joinTree) {
        let sqlJoinParts = joinGenerator.getJoinSQL(joinTree.joins, joinTree.alias);
        return `FROM ${joinTree.table}\n` + sqlJoinParts.map(x => `        ${x}`).join("\n");
    }

    static getJoinSQL(joinObj, tableName) {
        let joins = [];
        for (let key in joinObj) {
            let joinRow = joinObj[key];
            joins.push(`LEFT JOIN ${joinRow.table} ${joinRow.alias} ON ${tableName}.${joinRow.right} = ${joinRow.alias}.${joinRow.left}`);
            if (joinRow.joins) {
                joins.push(...joinGenerator.getJoinSQL(joinRow.joins, joinRow.alias));
            }
        }
        return joins;
    }
}

module.exports = joinGenerator;