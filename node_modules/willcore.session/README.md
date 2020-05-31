<p align="center">
<img src="res/WillCoreLogo.png"  />
<h1 align="center">WillCore.Session</h1>
<h5 align="center">Lightweight session provider for WillCore.Server - By Philip Schoeman</h5>
</p>

___

> WillCore.Session is a module that contains additional assignables that provides simple and lightweight session functionality in WillCore.Server.

___

WillCore.Session allows you to create session state within [WillCore.Server](https://github.com/PhilipCoder/willcore.server) and [WIllCore.UI](https://github.com/PhilipCoder/WillCore.UI). For more information check their documentation.

## 1) Getting Started

To install on an __existing WillCore.Server__ project using NPM:

```javascript
npm install willcore.session
```

Enable sessions on a server instance:

```javascript
serverInstance.sessionName.session;
```

## 2) Assignable Overview

__Session Assignable__

Activates the session module in a WillCore server.

| Target | Property Name | Assignable Name | Values |
| ------ | ------------- | --------------- | ------ |
| [Server](https://github.com/PhilipCoder/willcore.server#server-assignable) | Has name | session | none |

__Session Properties__

| Property Name | Property Type | Description | Default Value |
| ------ | ------------- | --------------- | ---------------- |
| cookie | string | Name of the session cookie | "willCore_session" |
| encryptionKey | String | 32 Character string, used to encrypt the session cookie with | "Q3UBzdH9GEfiRCTKbi5MTPyChpzXLsTD" |
| timeout | Number | Expiration time of the cookie, in seconds | 21600 |
| sameSite | bool | Asserts that a cookie must not be sent with cross-origin requests | false |
| domain | string | Host to which the cookie will be sent. | null |

> By activating the session assignable an object containing the session data will become available on a property with the same name as the session assignable will be added on the action model.

__Authorize Assignable__

Adds an [interceptor](https://github.com/PhilipCoder/willcore.server#request-interceptors) to an action (RPC or REST) and file service that will only allow access to an action or files if a valid session is present. When the interceptor is set to before, the request will be blocked and the action not executed. If the interceptor is set to after, the action will execute and then request will be blocked.

| Target | Property Name | Assignable Name | Values |
| ------ | ------------- | --------------- | ------ |
| [RPC Actions](https://github.com/PhilipCoder/willcore.server#rpc-actions), [REST Actions](https://github.com/PhilipCoder/willcore.server#rest-actions), [File](https://github.com/PhilipCoder/willcore.server#serving-a-single-file) and [Files](https://github.com/PhilipCoder/willcore.server#files-assignable) | before/after | session | none |

> When a request is blocked, an HTTP response code 501 will be returned.

## 3) Action Model Session Object

After activating the session module, an object will be available on the model of RPC actions and REST actions. This object will be available on a property with the same name as the session module. For example:

```javascript
//Activating the session:
serverInstance.user.session;
```

```javascript
//The session object will be available on
 model.user
```

__Methods on the Model Session Object__

| Type | Name | Parameters/Type | Result | Description |
| ------- | ------ | ------------- | --------------- | ---------------- |
| Function | authenticate | Object : Session Object | void | Sets the session cookie and the current session to the session object |
| Function | remove | None | void | Deletes the current session and logs the user out. |
| Property | authenticated | bool |  | A field that will always be available indicating if there is an active session. |

> All other session fields set on the session object via the authenticate method, will be available on the model session object.

## 4) Service To Verify Session

The Session module will add a service to verify if an active session exists. This service will be available at __/session/authenticated__.

The result of this service will be the session object if a session is active and a field authenticated will always be returned indicating if an active session is present.

## 5) Full Example

```javascript
//main.js - Setting up the server
const willCoreProxy = require("willcore.core");

let willcore = willCoreProxy.new();
willcore.testServer.server[__dirname] = 8581;
willcore.testServer.http;
//Activating the session on field "user"
willcore.testServer.user.session;
willcore.testServer.testService.service = "/testSessionService.js";
```

```javascript
module.exports = (service) => {
    //Action to authenticate and log a user in
    service.authenticate.action.post = async (model) => {
        if (model.password === "demoPassword" && model.email === "test@gmail.com"){
             model.user.authenticate({ email: "test@gmail.com" });
             model.message = "You are logged in";
        }else{
            model.message = "Invalid details provided.";
        }
    };
    //Action to verify if a user is logged in
    service.isAuthenticated.action.post = async (model) => {
        model.isAuthenticated = model.user.authenticated;
    };
    //This action will only be accessible when a session is valid
    service.blocked.action.get = async (model) => {
        model.message = "You are allowed";
    };
    service.blocked.before.authorize;
    //Action to log a user out.
    service.logout.action.get = async (model) => {
        model.user.remove();
        model.message = "Logged out";
    };
};
```