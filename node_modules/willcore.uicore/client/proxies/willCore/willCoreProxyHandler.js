import { assignableProxyHandler } from "../base/assignableProxyHandler.js";

class willCoreProxyHandler extends assignableProxyHandler {
    constructor(assignable) {
        super(assignable);
    }
}

export { willCoreProxyHandler };