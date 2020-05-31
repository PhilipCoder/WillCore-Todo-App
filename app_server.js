const willcore = require("willcore.core").new();

//init server
willcore.todoListServer.server[__dirname] = 8581;
willcore.todoListServer.server.http;
willcore.todoListServer.userSession.session;
willcore.todoListServer.ui;
willcore.todoListServer.ui.bootstrapEndpoint.bootstrap;
willcore.todoListServer.siteCss.style = "/views/style/site.css";
//services
willcore.todoListServer.dbService.service = "/services_server/db.js";
willcore.todoListServer.accounts.service = "/services_server/account.js";
willcore.todoListServer.todoItems.service = "/services_server/todoItems.js";