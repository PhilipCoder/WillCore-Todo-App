const assignable = require("willcore.core/assignable/assignable");
const serverProxy = require("willcore.server/proxies/server/serverProxy.js");

class metaTagAssignable extends assignable {
    constructor() {
        super({ string: 1 }, serverProxy);
    }

    completionResult() {
        return false;
    }

    completed() {
        this.parentProxy._metaTagRegistry.registerTag(this.bindedValues.string[0])
    }
}

module.exports = metaTagAssignable;