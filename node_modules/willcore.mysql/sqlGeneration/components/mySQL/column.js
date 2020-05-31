const keywords = require("./mySQLConstants.js").keywords;
const typeMappings =require("./mySQLConstants.js").typeMappings;
const status = require("../../migration/statusEnum.js");

class column {
    constructor(columnInfo){
        this.columnInfo = columnInfo;
    }

    getSQL(tableExists){
       let result = this.getSQLColumnStatement(tableExists);
       return result;
    }

    getSQLColumnStatement(tableExists){
        if (this.columnInfo.primary){
            return this.getPrimaryKey(tableExists);
        }else if (this.columnInfo.reference){
            return this.getForeignKey(tableExists);
        }else{
            return this.getColumn(tableExists);
        }
    }

    getColumn(tableExists){
        let alterationStatement = tableExists ? `${keywords.alterTable.addColumn} ` : '';
        let indexStatement = this.columnInfo.indexed ? `,\n${keywords.createColumn.index} d_${this.columnInfo.name}(${this.columnInfo.name})` : '';
        return `${alterationStatement}\`${this.columnInfo.name}\` ${this.getSQLType(this.columnInfo.type, this.columnInfo.size)} null${indexStatement}`;
    }

    getPrimaryKey(tableExists){
        let alterationStatement = tableExists ? `${keywords.alterTable.addColumn} ` : '';
        return `${alterationStatement}\`${this.columnInfo.name}\` ${this.getSQLType(this.columnInfo.type, this.columnInfo.size)} ${keywords.createColumn.primaryKey}`;
    }

    getForeignKey(tableExists){
        let alterationAddStatement = tableExists ? `${keywords.alterTable.add} ` : '';
        let indexName = `${this.columnInfo.reference.thisTable}_${this.columnInfo.name}_${this.columnInfo.reference.table}_${this.columnInfo.reference.column}`;
        let result = this.columnInfo.status === status.new ? `${this.getColumn(tableExists)},\n` : '';
        result += `${alterationAddStatement}${keywords.createColumn.index} ${indexName}(${this.columnInfo.name}),\n` +
        `${alterationAddStatement}${keywords.alterTable.constraint} \`fk_${indexName}\` ${keywords.createColumn.foreignKey} (${this.columnInfo.name}) ${keywords.createColumn.reference} ${this.columnInfo.reference.table}(${this.columnInfo.reference.column}) ${keywords.createColumn.keyDelete}`;
        return result;
    }

    getSQLType(name, typeSize){
        let typeMapping = typeMappings[name];
        if (typeMapping){
            let size = typeSize || typeMapping.defaultSize;
            let hasSize = typeMapping.resizeAble && size;
            let sqlSize = hasSize ? Array.isArray(size) ? `(${size.join(",")})` : `(${size})` : "";
            return `${typeMapping.dbType}${sqlSize}`;
        }else{
            throw `No MySQL type mapping for type ${name} found.`;
        }
    }
}

module.exports = column;