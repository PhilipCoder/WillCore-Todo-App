import { willCoreProxy } from "./ui.js"
import {init} from "../app.js";
(async () => {
    let proyxyIntance = await willCoreProxy.new();
    init(proyxyIntance);
})();
