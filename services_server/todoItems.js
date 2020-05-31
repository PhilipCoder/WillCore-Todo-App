const service = async (service, server, willcore) => {

    //Action to add a todo item
    service.addItem.action.post = async (model) => {
        const queryDB = willcore.todoDB.queryDB;
        queryDB.notes.add({
            user: model.userSession.id,
            title: model.title,
            description: model.description
        });
        await queryDB.save();
        model.success = true;
    };
    service.addItem.before.authorize;

    //Action to get all todo items
    service.getItems.action.get = async (model) => {
        const queryDB = willcore.todoDB.queryDB;
        model.todoItems = await queryDB.notes.filter((notes) => notes.user === userId, { userId: model.userSession.id })();
    };
    service.getItems.before.authorize;

    //Action to delete a totoItem
    service.deleteItem.action.post = async (model) => {
        const queryDB = willcore.todoDB.queryDB;
        const userNote = await queryDB.notes.filter((notes) => notes.user.id === userId && notes.id === noteId, { userId: model.userSession.id, noteId: model.id })();
        if (userNote.length > 0) {
            queryDB.notes.delete(model.id);
            await queryDB.save();
            model.success = true;
        }else{
            model.success = false;
        }
    };
    service.deleteItem.before.authorize;

    //Action to delete a totoItem
    service.updateItem.action.post = async (model) => {
        const queryDB = willcore.todoDB.queryDB;
        const userNote = await queryDB.notes.filter((notes) => notes.user.id === userId && notes.id === noteId, { userId: model.userSession.id, noteId: model.id })();
        if (userNote.length > 0) {
            userNote[0].title = model.title;
            userNote[0].description = model.description;
            await queryDB.save();
            model.success = true;
        }else{
            model.success = false;
        }
    };
    service.updateItem.before.authorize;
};

module.exports = service;