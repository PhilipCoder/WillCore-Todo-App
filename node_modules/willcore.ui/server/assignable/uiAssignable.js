const coreUIAssignable = require("willcore.uicore/server/assignables/coreUIAssignable.js");
const path = require("path");
const uiProxy = require("../proxies/uiProxy.js");


class uiAssignable extends coreUIAssignable {
    constructor() {
        super();
    }

    register(){
        this.fileServiceName = "uiModules";
        let endPointFolder = path.normalize(`${__dirname}/../../client`);
        let mainExecutingDirectory = this.parentProxy._assignable.pathHelper.rootDirectory;
        let relativePath = path.relative(mainExecutingDirectory, endPointFolder);
        relativePath = "/" + relativePath.split("\\").join("/");

        this.folderPath =  relativePath;
        this.addClientAssignable("ui", "/uiModules/assignables/uiAssignable.js");
        this.addClientAssignable("bind", "/uiModules/bindings/bind.js");
        this.addClientAssignable("model", "/uiModules/bindings/model.js");
        this.addClientAssignable("event", "/uiModules/bindings/event.js");
        this.addClientAssignable("disabled", "/uiModules/bindings/disabled.js");
        this.addClientAssignable("hide", "/uiModules/bindings/hide.js");
        this.addClientAssignable("options", "/uiModules/bindings/options.js");
        this.addClientAssignable("show", "/uiModules/bindings/show.js");
        this.addClientAssignable("style", "/uiModules/bindings/style.js");
        this.addClientAssignable("attribute", "/uiModules/bindings/attribute.js");
        this.addClientAssignable("repeat", "/uiModules/bindings/repeat.js");
        this.addClientAssignable("view", "/uiModules/bindings/view.js");
        this.addClientAssignable("location", "/uiModules/bindings/location.js");
        this.addClientAssignable("watch", "/uiModules/bindings/watch.js");
        this.addClientAssignable("class", "/uiModules/bindings/class.js");
        this.addClientAssignable("viewModel", "/uiModules/bindings/viewModel.js");
    }

    completionResult() {
        this.parentProxy.views.files = "/";
        return uiProxy.new(this);
    }
}

module.exports = uiAssignable;