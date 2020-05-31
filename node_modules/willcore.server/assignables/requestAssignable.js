const assignable = require("willcore.core/assignable/assignable");
const serviceProxy = require("../proxies/service/serviceProxy.js");

class requestAssignable extends assignable {
    constructor(bindingConstraints) {
        super(bindingConstraints, serviceProxy);
        this.requestFunction = null;
    }
    completed() {
        this.requestFunction = this.bindedValues["function"][0];
    }
}

module.exports = requestAssignable;