class scriptRegistry {
    constructor() {
        this.modules = [
            { type: "module", url: "/willcore/loader.js" }
        ];
    }

    registerScript(type, url) {
        this.modules.push({ type: type, url: url });
    }
}

module.exports = scriptRegistry;