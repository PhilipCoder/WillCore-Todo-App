const assignable = require("willcore.core/assignable/assignable");
const serverProxy = require("willcore.server/proxies/server/serverProxy.js");

class scriptModuleAssignable extends assignable {
    constructor() {
        super({ string: 1 }, serverProxy);
    }

    completionResult() {
        return false;
    }

    completed() {
        this.parentProxy._scriptRegistry.registerScript("module", this.bindedValues.string[0])
    }
}

module.exports = scriptModuleAssignable;