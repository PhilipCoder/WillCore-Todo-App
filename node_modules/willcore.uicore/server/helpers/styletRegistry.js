class styleRegistry {
    constructor() {
        this.modules = [];
    }

    registerStyle(type, url) {
        this.modules.push({ type: type, url: url });
    }
}

module.exports = styleRegistry;