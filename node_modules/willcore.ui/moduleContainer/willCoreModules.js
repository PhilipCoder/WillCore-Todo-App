const uiCoreModules = require("willcore.uicore/moduleContainer/willCoreModules.js");

module.exports = (willCoreModuleInstance) => {
    uiCoreModules(willCoreModuleInstance);
    willCoreModuleInstance.ui = () => require("../server/assignable/uiAssignable.js");
};