module.exports = (willCoreModuleInstance) => {
    willCoreModuleInstance.bootstrap = () => require("../assignable/bootstrapAssignable.js");
};