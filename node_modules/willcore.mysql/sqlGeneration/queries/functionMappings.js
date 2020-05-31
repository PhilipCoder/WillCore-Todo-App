const functionMappings = {
    aggregationFunctions: {
        count: function (tableAlias, column) {
            return `COUNT(${tableAlias}.${column})`;
        },
        avg: function (tableAlias, column) {
            return `AVG(${tableAlias}.${column})`;
        },
        max:function(tableAlias, column){
            return `MAX(${tableAlias}.${column})`;
        },
        min:function(tableAlias, column){
            return `MIN(${tableAlias}.${column})`;
        },
        sum:function(tableAlias, column){
            return `SUM(${tableAlias}.${column})`;
        }
    },
    queryColumnFunctions:{
        like:function(valueA,valueB){
            return `${valueA} LIKE ${valueB}`
        },
        notLike:function(valueA,valueB){
            return `${valueA} NOT LIKE ${valueB}`
        },
    },
    queryValuesFunctions:{
        dateDiff:function(valueA, valueB){
            return `DATEDIFF(${valueA},${valueB})`
        },
        equals:function(valueA, valueB){
            return `${valueA} = ${valueB}`;
        },
        notEquals:function(valueA, valueB){
            return `${valueA} <> ${valueB}`;
        },
        greaterThan:function(valueA, valueB){
            return `${valueA} > ${valueB}`;
        },
        smallerThan:function(valueA, valueB){
            return `${valueA} < ${valueB}`;
        },
        greaterOrEqualThan:function(valueA, valueB){
            return `${valueA} >= ${valueB}`;
        },
        smallerOrEqualThan:function(valueA, valueB){
            return `${valueA} <= ${valueB}`;
        }
    },
    queryValueFunctions:{
        day:function(value){
            return `DAY(${value})`
        },
    },
    queryFunctions:{
        isNull:function(tableAlias, column){
            return `${tableAlias}.${column} IS NULL`
        },isNotNull:function(tableAlias, column){
            return `${tableAlias}.${column} IS NOT NULL`
        }
    },
    statements:{
        now:function(){
            return `NOW()`
        }
    }
};

module.exports = functionMappings;