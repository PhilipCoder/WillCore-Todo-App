import { viewLoader } from "./viewLoader.js";

class router {
    constructor(parentProxy) {
        this.routeOverWrite = {
            "/": "/index"
        };
        this.parentProxy = parentProxy;
        this.previousUrl = null;
        this.registerEventHandler();
        let url = this.getUrl();
        this._viewLoader = new viewLoader(this.parentProxy);
        if (window.location.hash && window.location.hash.length > 0) {
            this.handleRoute(url);
        }
    }

    async handleRoute(url) {
        if (this.routeOverWrite[url]) {
            url = this.routeOverWrite[url];
        }
        let fullURL = this.getUrl(true);
        let renderResult = await this._viewLoader.renderView(url);
        if (typeof renderResult === "string") this.navigate(renderResult);
    }

    getUrl(returnFull) {
        let url = window.location.hash.slice(1) || "/";
        if (returnFull) return url;
        if (url.indexOf("?") > -1) {
            url = url.substring(0, url.indexOf("?"));
        }
        return url;
    }

    registerEventHandler() {
        window.addEventListener('hashchange', event => {
            this.handleRoute(this.getUrl());
        });
    }

    navigate(route, routeParameters) {
        let parameters = [];
        let parameterString = "";
        if (routeParameters && typeof routeParameters === "object") {
            for (let key in routeParameters) {
                parameters.push(`${key}=${encodeURIComponent(routeParameters[key])}`);
            }
            if (parameters.length > 0) {
                parameterString = "?" + parameters.join("&");
            }
        }
        var forceUrl = false;
        let url = window.location.hash.slice(1) || "/";
        if (url.indexOf("?") > -1) {
            url = url.substring(url.indexOf("?"));
            forceUrl = url.indexOf("forceUrl=true") > -1;
        }
        if (!forceUrl) {
            window.location.hash = route + parameterString;
        }
    };
}

export { router };