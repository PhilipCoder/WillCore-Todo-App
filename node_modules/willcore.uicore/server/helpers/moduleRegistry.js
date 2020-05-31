class _moduleRegistry {
    constructor() {
        this.modules = {};
    }

    registerModule(name, url) {
        this.modules[name] = { name: name, url: url };
    }

    containsModule(name) {
        return !!this.modules[name];
    }

    getModuleURL(name) {
        return this.modules[name] ? this.modules[name].url : null;
    }

    getModules(){
        return Object.keys(this.modules).map(key => this.modules[key]);
    }
}

const moduleRegistry = new _moduleRegistry();

module.exports = moduleRegistry;