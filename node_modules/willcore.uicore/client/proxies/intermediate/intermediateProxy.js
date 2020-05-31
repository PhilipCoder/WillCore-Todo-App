import { intermediateProxyHandler } from"./intermediateProxyHandler.js";
/**
 * Proxy class for the main intermediate assignable instanciation.
 */
class intermediateProxy{
   /**
    * Factory method.
    * @param {Proxy} parentProxy 
    * @param {String} parentProperty 
    */
    static new(parentProxy, parentProperty){
        return new Proxy(new intermediateProxy(), new intermediateProxyHandler(parentProxy,parentProperty));
    }
}

export { intermediateProxy };