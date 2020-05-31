const coreUIAssignable = require("../../server/assignables/coreUIAssignable.js");

class testAssignable extends coreUIAssignable{
    constructor(){
        super();
        this.fileServiceName = "testModule";
        this.folderPath = "/";
        this.addClientAssignable( "test", "/testModule/testAssignable.js");
    }
}

module.exports = testAssignable;