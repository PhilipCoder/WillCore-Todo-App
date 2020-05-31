import { moduleProxy } from "./moduleProxy.js";
import { lazyImport } from "../../helpers/lazyImport.js";
import { request } from "../../helpers/request.js";

let moduleList = "/modules/assignables";
let packageList = null;

class willCoreModules {
    constructor() {
    }

    get(target, property, proxy) {
        let throwError = true;
        if (property.startsWith("&")) {
            throwError = false;
            property = property.substring(1);
        }
        if (property.startsWith("_")) {
            return target[property];
        }
        else if (target[property]) {
            return target[property];
        }
        else if (property !== "then") {
          return null;
        }
    }

    set(target, property, value) {
        if (property.startsWith("_")) {
            target[property] = value;
        }
        else if (value instanceof moduleProxy) {
            target[property] = value;
        }
        return true;
    }

    static new() {
        let modulesTarget = new moduleProxy();
        modulesTarget.prepopulate = async function () {
            if (!modulesTarget.loaded) {
                modulesTarget.loaded = true;
                let modulesList = await request.getRequest(moduleList);
                modulesList = Object.keys(modulesList).map(key => modulesList[key]);
                let promises = modulesList.map(packageDetails => {
                    let module = lazyImport(packageDetails.url);
                    module.then(data => modulesTarget[packageDetails.name] = data.component);
                    return module;
                });
                await Promise.all(promises);
            }
        }
        return new Proxy(modulesTarget, new willCoreModules());
    }

}

let moduleContainer = willCoreModules.new();

export { moduleContainer };