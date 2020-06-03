const assignable = require("willcore.core/assignable/assignable");
const uiProxy = require("willcore.ui/server/proxies/uiProxy.js");
const path = require("path");

class fontAwesomeAssignable extends assignable {
    constructor() {
        super({}, uiProxy);
    }

    completed() {
        this.registerBootstrapFileService();
    }
    completionResult() {
        return false;
    }

    registerBootstrapFileService(){
        const serverProxy = this.parentProxy._assignable.parentProxy;
        let relativePath = this.getFilesFolderPath(serverProxy);
        serverProxy[this.propertyName].files = `${relativePath}`;
        serverProxy.fontAwesomeStyle.style = `/${this.propertyName}/css/all.css`;
    }

    getFilesFolderPath(serverProxy) {
        let endPointFolder = path.normalize(`${__dirname}/../fontAwesome`);
        let mainExecutingDirectory = serverProxy._assignable.pathHelper.rootDirectory;
        let relativePath = path.relative(mainExecutingDirectory, endPointFolder);
        relativePath = "/" + relativePath.split("\\").join("/");
        return relativePath;
    }
}

module.exports = fontAwesomeAssignable;