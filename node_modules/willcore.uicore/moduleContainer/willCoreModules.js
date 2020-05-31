module.exports = (willCoreModuleInstance) => {
    willCoreModuleInstance.scriptModule = () => require("../server/assignables/scriptModuleAssignable.js");
    willCoreModuleInstance.script = () => require("../server/assignables/scriptAssignable.js");
    willCoreModuleInstance.style = () => require("../server/assignables/styleAssignable.js");
    willCoreModuleInstance.metaTag = () => require("../server/assignables/metaTagAssignable.js");
    willCoreModuleInstance.uicore = () => require("../server/testAssignable/testAssignable.js");
};