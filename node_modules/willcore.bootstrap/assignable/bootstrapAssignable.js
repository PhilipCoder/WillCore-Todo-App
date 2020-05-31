const assignable = require("willcore.core/assignable/assignable");
const uiProxy = require("willcore.ui/server/proxies/uiProxy.js");
const path = require("path");

class bootstrapAssignable extends assignable {
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
        serverProxy.jquerySlim.script = `/${this.propertyName}/jquery-3.5.1.slim.min.js`;
        serverProxy.bootstrapScript.script = `/${this.propertyName}/bootstrap.bundle.min.js`;
        serverProxy.bootstrapStyle.style = `/${this.propertyName}/bootstrap.min.css`;
        this.parentProxy._assignable.addClientAssignable("bootstrapModal",`/${this.propertyName}/modal.js`);
        this.parentProxy._assignable.addClientAssignable("bootstrapCarousel",`/${this.propertyName}/carousel.js`);
        this.parentProxy._assignable.addClientAssignable("bootstrapCollapse",`/${this.propertyName}/collapse.js`);
        this.parentProxy._assignable.addClientAssignable("bootstrapDropdown",`/${this.propertyName}/dropdown.js`);
        this.parentProxy._assignable.addClientAssignable("bootstrapPopover",`/${this.propertyName}/popover.js`);
        this.parentProxy._assignable.addClientAssignable("bootstrapTooltip",`/${this.propertyName}/tooltip.js`);
        this.parentProxy._assignable.addClientAssignable("bootstrapAlert",`/${this.propertyName}/alert.js`);
        this.parentProxy._assignable.addClientAssignable("bootstrapPrompt",`/${this.propertyName}/prompt.js`);
        this.parentProxy._assignable.addClientAssignable("bootstrapToast",`/${this.propertyName}/toast.js`);

    }

    getFilesFolderPath(serverProxy) {
        let endPointFolder = path.normalize(`${__dirname}/../bootstrap`);
        let mainExecutingDirectory = serverProxy._assignable.pathHelper.rootDirectory;
        let relativePath = path.relative(mainExecutingDirectory, endPointFolder);
        relativePath = "/" + relativePath.split("\\").join("/");
        return relativePath;
    }
}

module.exports = bootstrapAssignable;