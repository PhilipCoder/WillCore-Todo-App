const dbSettings = require("../dbSettings.json");

const service = async (service, server, willcore) => {
    willcore.todoDB.mysql = [dbSettings.ip, dbSettings.user, dbSettings.password];
    const todoDB = willcore.todoDB;
    //Users table
    todoDB.users.table;
    todoDB.users.id.column.int;
    todoDB.users.id.primary;
    todoDB.users.firstName.column.string;
    todoDB.users.lastName.column.string;
    todoDB.users.email.column.string;
    todoDB.users.password.column.string;
    //notes
    todoDB.notes.table;
    todoDB.notes.id.column.int;
    todoDB.notes.id.primary;
    todoDB.notes.title.column.string;
    todoDB.notes.description.column.text;
    //Relationship
    todoDB.notes.user = todoDB.users.id;
    todoDB.users.notes = todoDB.notes.user;

    await todoDB.init();
};

module.exports = service;