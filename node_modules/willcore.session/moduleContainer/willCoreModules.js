module.exports = (willCoreModuleInstance) => {
    willCoreModuleInstance.session = () => require("../server_server/assignables/sessionAssignable.js");
    willCoreModuleInstance.authorize = () => require("../server_server/assignables/blockUnauthorizedAssignable.js");
};