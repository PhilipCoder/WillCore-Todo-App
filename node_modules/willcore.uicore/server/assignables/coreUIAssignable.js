const assignable = require("willcore.core/assignable/assignable");
const serverProxy = require("willcore.server/proxies/server/serverProxy.js");
const moduleRegistry = require("../helpers/moduleRegistry.js");
const path = require("path");
const scriptRegistry = require("../helpers/scriptRegistry.js");
const styletRegistry = require("../helpers/styletRegistry.js");
const metaTagRegistry = require("../helpers/metaTagRegistry.js");
const indexHTMLGenerator = require("../helpers/indexHTMLGenerator.js");
const serviceResult = require("willcore.server/models/serviceResult.js");

class coreUIAssignable extends assignable {
    constructor() {
        super({}, serverProxy);
        this.fileServiceName = null;
        this.folderPath = null;
        this.clientAssignables = [];
        this.isAssigned = false;
    }

    static get noValues() {
        return serverProxy;
    }

    addClientAssignable(assignableName, fileURL) {
        this.clientAssignables.push({ name: assignableName, fileURL: fileURL });
        if (this.isAssigned && this.parentProxy){
            this.parentProxy._moduleRegistry.registerModule(assignableName, fileURL)
        }
    }

    completionResult() {
        return false;
    }

    completed() {
        if (this.register) this.register();
        if (!this.parentProxy._moduleRegistry) {
            this.parentProxy._moduleRegistry = moduleRegistry;
            this.createService();
            this.createCoreFileServer();
        }
        this.validateValues();
        this.createRegistries();
        this.clientAssignables.forEach(entry => this.parentProxy._moduleRegistry.registerModule(entry.name, entry.fileURL));
        this.isAssigned = true;
        this.createFileServer(this.folderPath);
        this.createIndexHTMLService();
    }

    createRegistries(){
        if (!this.parentProxy._scriptRegistry) {
            this.parentProxy._scriptRegistry = new scriptRegistry();;
        }
        if (!this.parentProxy._styleRegistry) {
            this.parentProxy._styleRegistry = new styletRegistry();
        }
        if (!this.parentProxy._metaTagRegistry){
            this.parentProxy._metaTagRegistry = new metaTagRegistry();
        }
    }

    createIndexHTMLService(){
        this.parentProxy.indexFile.executableService["/"] = ()=> new serviceResult(200,"text/html",indexHTMLGenerator(this.parentProxy._metaTagRegistry, this.parentProxy._scriptRegistry, this.parentProxy._styleRegistry));
    }

    validateValues() {
        if (typeof this.fileServiceName !== "string" || this.fileServiceName.length === 0) {
            throw `Invalid file service activation name: ${this.fileServiceName}.`;
        }
        if (typeof this.folderPath !== "string" || this.folderPath.length === 0) {
            throw `Invalid folder path: ${this.folderPath}. The folder path should be valid string path.`;
        }
    }

    createFileServer(directory) {
        this.parentProxy[this.fileServiceName].files = directory;
        this.parentProxy.appStart.file["/app.js"] =  "/app.js";
    }

    createService() {
        let endPointFolder = path.normalize(`${__dirname}/..`);
        let moduleDirectory = path.join(endPointFolder, "/endPoints/modulesActions.js");
        let mainExecutingDirectory = this.parentProxy._assignable.pathHelper.rootDirectory;
        let relativePath = path.relative(mainExecutingDirectory, moduleDirectory);
        relativePath = "/" + relativePath.split("\\").join("/");
        this.parentProxy.modules.service = relativePath;
    }

    createCoreFileServer() {
        let endPointFolder = path.normalize(`${__dirname}/../..`);
        let moduleDirectory = path.join(endPointFolder, "/client/");
        let mainExecutingDirectory = this.parentProxy._assignable.pathHelper.rootDirectory;
        let relativePath = path.relative(mainExecutingDirectory, moduleDirectory);
        relativePath = "/" + relativePath.split("\\").join("/");
        this.parentProxy.willcore.files = relativePath;
    }
}

module.exports = coreUIAssignable;