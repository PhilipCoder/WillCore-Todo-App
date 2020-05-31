module.exports = (service, server) => {
    service.assignables.action.get = async (model) => {
        server._moduleRegistry.getModules().forEach(module => {
            model[module.name] = module;
        });
    };
};