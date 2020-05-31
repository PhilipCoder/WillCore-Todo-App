module.exports = (willCoreModuleInstance) => {
       willCoreModuleInstance.server = () => require("../assignables/serverAssignable.js");
       willCoreModuleInstance.service = () => require("../assignables/serviceAssignable.js");
       willCoreModuleInstance.files = () => require("../assignables/filesServerAssignable.js");
       willCoreModuleInstance.file = () => require("../assignables/fileServerAssignable.js");
       willCoreModuleInstance.action = () => require("../assignables/actionRPCAssignable.js");
       willCoreModuleInstance.actionREST = () => require("../assignables/actionRESTAssignable.js");
       willCoreModuleInstance.interceptor = () => require("../assignables/requestInterceptorAssignable.js");
       willCoreModuleInstance.alias = () => require("../assignables/requestAliasAssignable.js");
       willCoreModuleInstance.compression = () => require("../assignables/responseCompressionAssignable.js");
       willCoreModuleInstance.http = () => require("../assignables/serverHTTP.js");
       willCoreModuleInstance.https = () => require("../assignables/serverHTTPS.js");
       willCoreModuleInstance.executableService = () => require("../assignables/executableServiceAssignable.js");
};