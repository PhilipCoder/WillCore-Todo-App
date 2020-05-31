const view = async (model,ui, server) => {
    //Data Collection
    model.sessionState = {
        loggedIn : null
    };

    //Bindings
    model.$loginDiv.show = () => model.sessionState.loggedIn === false;
    model.$notesDiv.show = () => model.sessionState.loggedIn === true;
    model.sessionState.loggedIn =  (await server.session.authenticated.get()).authenticated;
};

const layout = "/views/layouts/navLayout";

export { view, layout};