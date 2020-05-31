const willCoreModules = require("../proxies/moduleContainment/moduleProxyHandler.js");

let willCoreModuleInstance = willCoreModules.new();
willCoreModuleInstance.assignables = willCoreModules.new();
willCoreModuleInstance.assignables.defaultValues = () => require("../assignable/defaultAssignable.js");

willCoreModuleInstance._reset = () => {
    willCoreModuleInstance.assignables = willCoreModules.new();
    willCoreModuleInstance.assignables.defaultValues = () => require("../assignable/defaultAssignable.js");
};

module.exports = willCoreModuleInstance;