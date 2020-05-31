const entityProxyHandler = require("./entityProxyHandler.js");

class entityProxy {
    static new(values, dbInfo) {
        let proxy = new entityProxy();
        proxy = this.buildProxyTree(proxy,values,dbInfo);
        let proxyHandler = new entityProxyHandler();
        return new Proxy(proxy, proxyHandler);
    }
    
    static newSubProxy(){
        let proxy = new entityProxy();
        let proxyHandler = new entityProxyHandler();
        return new Proxy(proxy, proxyHandler);
    }

    
}

module.exports = entityProxy;