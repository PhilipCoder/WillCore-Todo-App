const functionMappings = require("../../sqlGeneration/queries/functionMappings.js");
/**
 * Class that preprocess a list of tokens and matches JS statement operators to SQL generator functions.
 * 
 * Author: Philip Schoeman
 */
class tokenPreProcessor {
    constructor() {
        /**
         * Map of JS statement operators to SQL generator functions.
         */
        this.generatorMappings = {
            "==": ["queryValuesFunctions", "equals"],
            "===": ["queryValuesFunctions", "equals"],
            "!=": ["queryValuesFunctions", "notEquals"],
            "!==": ["queryValuesFunctions", "notEquals"],
            ">": ["queryValuesFunctions", "greaterThan"],
            "<": ["queryValuesFunctions", "smallerThan"],
            "<=": ["queryValuesFunctions", "greaterOrEqualThan"],
            "=>": ["queryValuesFunctions", "smallerOrEqualThan"]
        };
    }
    /**
     * Translate JS statement operators in a expression token array to SQL generator functions.
     * 
     * @param {ArrayLike<Object>} parts Array of expression tokens to preprocess.
     */
    process(parts){
        let results =[];
        let currentIndex = 0;
        let currentFunction = null;
        let functionParameter = [];
        for (let partI = 0; partI < parts.length; partI++){
            let part = parts[partI];
            part.index = currentIndex;
            let generatorMapping = part.type === "Punctuator" ? this.generatorMappings[part.value] : null;
            if (generatorMapping && currentFunction){
                throw `Invalid query.`;
            }
            else if (generatorMapping && !currentFunction){
                results.push({type: "Punctuator",value: ".",index: currentIndex});
                currentIndex++;
                currentFunction = { type:"Identifier", value:generatorMapping[1], index:currentIndex};
                results.push(currentFunction);
                currentIndex++;
                results.push({type: "Punctuator",value: "(",index: currentIndex});
            } else if (currentFunction && part.type === "Punctuator" && part.value !== "."){
                results.push({type: "Punctuator",value: ")",index: currentIndex});
                currentIndex++;
                results.push(part);
                currentFunction = null;
            }else{
                results.push(part);
            }
            currentIndex++;
        }
        if (currentFunction){
            results.push({type: "Punctuator",value: ")",index: currentIndex});
        }
        return results;
    }
}

module.exports = tokenPreProcessor;