const view = async (model, ui, server, events) =>  {
    model.sessionState = {
        loggedIn : null
    };
    model.$loggedOutNav.show = () => model.sessionState.loggedIn === false;
    model.$loggedInNav.show = () => model.sessionState.loggedIn === true;
    model.$logoutDiv.show = () => model.sessionState.loggedIn === true;


    model.sessionState.loggedIn =  (await server.session.authenticated.get()).authenticated;
    model.$logoutLink.onclick.event = async () => {
        await server.accounts.logout.post();
        model.sessionState.loggedIn = false;
        model.location.navigate("/views/views/login");
    };

    //Set nav active state
    model.$homeNav.active.class = () => model.location.name === "index" || model.location.name === "";
    model.$todoListNav.active.class = () => model.location.name === "todoList";
    events.navigate = (navigationData) =>{
        model.location.name = navigationData.name;
    };
};

const containerId = "viewContainer";

export { view, containerId };