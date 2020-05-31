const service = async (service, server, willcore) => {

    //Action to register a new user
    service.register.action.post = async (model) => {
        const queryDB = willcore.todoDB.queryDB;
        //more validation can be done here
        let existingUsers = await queryDB.users.filter((users) => users.email === userEmail, { userEmail: model.email })();
        if (existingUsers.length > 0) {
            model.message = `Email is already registered.`;
            model.success = false;
        }
        else {
            queryDB.users.add(
                {
                    firstName: model.firstName,
                    lastName: model.lastName,
                    email: model.email,
                    password: model.password
                }
            );
            await queryDB.save();
            let existingUsers = await queryDB.users.filter((users) => users.email === userEmail && users.password === userPassword, { userEmail: model.email, userPassword: model.password })();
            model.userSession.authenticate({ email: model.email, id: existingUsers[0].id });
            model.message = `Account created. You are now logged in.`;
            model.success = true;
        }
    };

    //Action to authenticate a user
    service.login.action.post = async (model) => {
        const queryDB = willcore.todoDB.queryDB;
        //more validation can be done here
        let existingUsers = await queryDB.users.filter((users) => users.email === userEmail && users.password === userPassword, { userEmail: model.email, userPassword: model.password })();
        if (existingUsers.length > 0) {
            model.userSession.authenticate({ email: model.email, id: existingUsers[0].id });
            model.message = `Login Success!`;
            model.success = true;
        } else {
            model.message = `Login Failed.`;
            model.success = false;
        }
    };

    service.logout.action.post = async (model) => {
        model.userSession.remove();
    }
};

module.exports = service;