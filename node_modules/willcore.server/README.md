<p align="center">
<img src="res/WillCoreLogo.png"  />
<h1 align="center">WillCore.Server</h1>
<h5 align="center">Build With Proxies - By Philip Schoeman</h5>
<h5 align="center">License : MIT</h5>
</p>

## Index

- [Index](#index)
    - [The syntax for assignables is:](#the-syntax-for-assignables-is)
- [Getting started](#getting-started)
    - [Installing WillCore.Server](#installing-willcoreserver)
- [Creating a server](#creating-a-server)
  - [__Server assignable__](#server-assignable)
    - [Server Assignable values](#server-assignable-values)
  - [__HTTP assignable__](#http-assignable)
    - [HTTP Assignable values](#http-assignable-values)
  - [__HTTPS assignable__](#https-assignable)
    - [HTTPS Assignable values](#https-assignable-values)
    - [Creating a HTTP server](#creating-a-http-server)
    - [Creating a HTTPS server](#creating-a-https-server)
- [Serving a single file](#serving-a-single-file)
  - [__File assignable__](#file-assignable)
    - [Assignable values](#assignable-values)
    - [For instance to display a file **"/views/index.html"** home page on **http://localhost:8580**:](#for-instance-to-display-a-file-%22viewsindexhtml%22-home-page-on-httplocalhost8580)
- [Serving files in a directory](#serving-files-in-a-directory)
  - [__Files assignable__](#files-assignable)
    - [Assignable values](#assignable-values-1)
    - [Serving files in a folder](#serving-files-in-a-folder)
  - [__Services__](#services)
  - [__Service assignable__](#service-assignable)
    - [Assignable values](#assignable-values-2)
    - [Defining A Service](#defining-a-service)
    - [The Service Module](#the-service-module)
    - [Example Of A Service Module](#example-of-a-service-module)
  - [__Actions__](#actions)
    - [Supported HTTP Verbs](#supported-http-verbs)
  - [__RPC Actions__](#rpc-actions)
  - [__Action assignable__](#action-assignable)
    - [Action Assignable values](#action-assignable-values)
    - [Defining actions :](#defining-actions)
  - [__REST Actions__](#rest-actions)
  - [__ActionREST assignable__](#actionrest-assignable)
    - [Action Assignable values](#action-assignable-values-1)
    - [Defining REST actions :](#defining-rest-actions)
  - [__Action Aliases__](#action-aliases)
  - [__Action assignable__](#action-assignable-1)
    - [Action Assignable values](#action-assignable-values-2)
    - [Using Action Aliases](#using-action-aliases)
  - [__Request Interceptors__](#request-interceptors)
  - [__Interceptor assignable__](#interceptor-assignable)
    - [Interceptor Assignable values](#interceptor-assignable-values)
  - [Action Interceptors](#action-interceptors)
    - [Action Interceptor Function Parameters](#action-interceptor-function-parameters)
    - [Using An Interceptor To Block Access To An Action](#using-an-interceptor-to-block-access-to-an-action)
    - [File Interceptor Function Parameters](#file-interceptor-function-parameters)

___

In order to make the API as simple as possible, WillCore uses the concept of assignables to instantiate and assign state to internal objects. The concept might be a bit weird at first, but it simplifies the API.

<br/>

E1) Let's take the following example:

```javascript
//Creates an instance of the database class and assign values to it.
let dataBase = new mySQL();
dataBase.connectionString = "127.0.0.1";
dataBase.userName = "root";
dataBase.password = "mypassword";
//Adds a table to the database
let userTable = new table();
userTable.name = "usersDB";
dataBase.tables.add(userTable);
```

In the example above we use traditional Class or Function instantiation and then we assign properties to the instance. But by doing so we are expecting the programmer to know the API and what values to assign. But what if the class itself knew what values to assign where? That is where assignables come in.

<br/>

E2) Doing it the assignable way:

```javascript
//Creating an instance of the mysql database named "usersDB"
dbProxy.usersDB.mysql = ["127.0.0.1", "userName", "password"];
//Defining a table on the database named "usersTable"
dbProxy.usersDB.usersTable.table;
```
<br/>

>The two examples above do the exact same thing. 
When the class is assigned to $elementId, the framework checks if the class inherits from an assignable. Then it creates an instance of the mysql class. The instance of the mysql class then tells WillCore that it needs 3 strings to complete assignment. When the strings are assigned, the mysql class initiates itself.

 #### The syntax for assignables is: 

> proxyInstance.newPropertyName.newObjectType = assignmentValues (optional)

* __Proxy Instance :__ An instance of a proxy that supports assignables. In the case of WillCore.Data, it can be the main proxy, a database proxy, table proxy or column proxy.
* __New Property Name :__  The name of the property that has to be created or set on the proxy.
* __New Object Type :__ The type of the value that is created on the parent proxy.

## Getting started

WillCore.Server is an expansion module on the WillCore framework. It provides easy to use HTTP/HTTPS webserver functionality. WillCore.Server can easily be extended by installing willCore assignable modules. Out of the box it provides the following features:

* HTTP/HTTPS web server.
* File server.
* RPC and REST service functionality (JSON).

#### Installing WillCore.Server

WillCore.Server can be installed as an extension module on WillCore.Server:

```javascript
npm install willcore.core
npm install willcore.server
```


## Creating a server

As with other willCore modules, the main willCore proxy needs to be imported and the server created the assignable way.

### __Server assignable__

Has Name | Assignable values | Assignable result | Can assign to
-------- | ----------------- | ----------------- | -------------
   ✔    | 1 Number, 1 String          |  serverProxy     | willCoreProxy

#### Server Assignable values

String Values | Number Values | Function Values
------------- | ------------- | ---------------
 Server File Root Directory | Server TCP port | _ 

<br/>

### __HTTP assignable__

Has Name | Assignable values | Assignable result | Can assign to
-------- | ----------------- | ----------------- | -------------
   ❌    | -          |  Promise< void >     | serverProxy

#### HTTP Assignable values

String Values | Number Values | Function Values
------------- | ------------- | ---------------

<br/>

### __HTTPS assignable__

Has Name | Assignable values | Assignable result | Can assign to
-------- | ----------------- | ----------------- | -------------
   ❌    | -          |  Promise< void >     | serverProxy

#### HTTPS Assignable values

String Values | Number Values | Function Values
------------- | ------------- | ---------------

<br/>

#### Creating a HTTP server

```javascript
//Importing the willCore proxy
const willCoreProxy = require("willcore.core");

//Lets use a IIFE to use async functionality.
(async () => {
    //New WillCore proxy instance.
    const wCProxyInstance = willCoreProxy.new();
    //Creates a new server named "testServer" on port 8580
    coreProxy.testServer.server[__dirname] = 8580;
    //Configure for http
    await coreProxy.testServer.http;
})();
```

#### Creating a HTTPS server

```javascript
//Importing the willCore proxy
const willCoreProxy = require("willcore.core");

//Lets use a IIFE to use async functionality.
(async () => {
    //New WillCore proxy instance.
    const wCProxyInstance = willCoreProxy.new();
    //Creates a new server named "testServer" on port 8580
    coreProxy.testServer.server[__dirname] = 8580;
    //Configure for http
    await coreProxy.testServer.https;
})();
```

> #### Important: When creating a HTTPS server, you need to run your IDE and as administrator. WillCore.Core will install a self signed certificate into your Windows' trusted root certificate store and needs admin rights to do so.

## Serving a single file

> #### Important: Keep in mind that when files are being served, all files including server-side file will be served. To block files being served, make sure that there is "_server" included in the file path. Either put the server files in a folder named *_server or name the files *_server. Example: /services_server/products.js or /services/products_server.js.

### __File assignable__

Has Name | Assignable values | Assignable result | Can assign to
-------- | ----------------- | ----------------- | -------------
   ✔    | 2 String          |  fileServerProxy     | serverProxy

#### Assignable values

String Values | Number Values | Function Values
------------- | ------------- | ---------------
Activation URL | _ | _ 
Path to file on file system that should be served | _ | _ 
<br/>


In order to serve a file on a predefined URL, the file assignable can be used. 

#### For instance to display a file **"/views/index.html"** home page on **http://localhost:8580**:

```javascript
//Importing the willCore proxy
const willCoreProxy = require("willcore.core");

//Lets use a IIFE to use async functionality.
(async () => {
    //New WillCore proxy instance.
    const wCProxyInstance = willCoreProxy.new();
    //Creates a new server named "testServer" on port 8580
    coreProxy.testServer.server[__dirname] = 8580;
    //Configure for http
    await coreProxy.testServer.https;
    //Serve the home page
     coreProxy.testServer.homePage.file["/"] = "/views/index.html";
     //Serve the about page
     coreProxy.testServer.homePage.file["/about"] = "/views/about.html";
})();
```

When navigating to https://localhost:8580 you will see the homepage. https://localhost:8580/about will be the about page.

## Serving files in a directory

When you need to serve files in a folder, for example so serve a folder with it's sub folders with JavaScript files, the files assignable can be used. The first segment of the file's URL is the part that will activate the assignable.


### __Files assignable__

Has Name | Assignable values | Assignable result | Can assign to
-------- | ----------------- | ----------------- | -------------
   ✔    | 1 String          |  filesServerProxy     | serverProxy

#### Assignable values

String Values | Number Values | Function Values
------------- | ------------- | ---------------
Path to directory that should be served | _ | _ 

<br/>

#### Serving files in a folder

```javascript
//Importing the willCore proxy
const willCoreProxy = require("willcore.core");

//Lets use a IIFE to use async functionality.
(async () => {
    //New WillCore proxy instance.
    const wCProxyInstance = willCoreProxy.new();
    //Creates a new server named "testServer" on port 8580
    coreProxy.testServer.server[__dirname] = 8580;
    //Configure for http
    await coreProxy.testServer.https;
    //Serve the javascript folder.
     coreProxy.testServer.jsFiles.files = "/javascript";
})();
```

When navigating to https://localhost:8580/jsFiles/bootstrap.js, the server will try and get the bootstrap.js file in the javascript folder and return it. If not found, a 404 error will be returned.

### __Services__

A service is a container of components that serve dynamic data. These components are called actions. A service is composed of the service assignable and a function that should be the main export of a different file.

### __Service assignable__

Has Name | Assignable values | Assignable result | Can assign to
-------- | ----------------- | ----------------- | -------------
   ✔    | 1 String          |  serviceProxy     | serverProxy

#### Assignable values

String Values | Number Values | Function Values
------------- | ------------- | ---------------
Path to service file | _ | _

<br/>

#### Defining A Service

```javascript
//Importing the willCore proxy
const willCoreProxy = require("willcore.core");

//Lets use a IIFE to use async functionality.
(async () => {
    //New WillCore proxy instance.
    const wCProxyInstance = willCoreProxy.new();
    //Creates a new server named "testServer" on port 8580
    coreProxy.testServer.server[__dirname] = 8580;
    //Configure for http
    await coreProxy.testServer.https;
    //Define a service in a file /services/dataService
     server.myService.service = "/services/dataService.js";
})();
```

#### The Service Module

The service module is a function that should be the default export of a separate file. This function will be executed as soon as the service module is instantiated. The function take the following parameters:

Parameter Index | Parameter Type | Parameter Description
--------------- | -------------- | ---------------------
1               | serviceProxy   | An instance of the service proxy of the function
2               | serverProxy    | An instance of the server proxy that the service is assigned to.
3               | willCoreProxy  | The main WillCore proxy instance.

#### Example Of A Service Module

```javascript
//services/dataService.js
module.exports = (serviceProxy, serverProxy, willcoreProxy) => {
  
};
```

### __Actions__

Actions are functions that are invoked via a request. An action receive data via a model and all changes done to the model inside the action will be returned. An action should be defined inside a service function. 

> Actions will bind all inbound query parameters, request body values and REST parameters to the model.

#### Supported HTTP Verbs

   * get
   * post
   * put
   * delete
   * patch


### __RPC Actions__

RPC actions parameters are send via the body of a request or query string parameters. Unlike REST actions RPC actions can't have parameters defined as part of the URL route.

### __Action assignable__

Has Name | Assignable values | Assignable result | Can assign to
-------- | ----------------- | ----------------- | -------------
   ✔    | 1 String, 1 function |  actionRPCProxy     | serviceProxy

#### Action Assignable values

String Values | Number Values | Function Values
------------- | ------------- | ---------------
HTTP Verb     | _ | Action function 


#### Defining actions :

```javascript
//Defines and exports the service module and function
module.exports = (service, server, willcore) => {
   //Action to get data Example URL: https://localhost:8410/serviceName/getData?data=SomeData
    service.getData.action.get = async (model) => {
        model.result = `Action received data: ${model.data}`;
    };
    //Action to add data
    service.addData.action.post = async (model) => {
        let valueToAdd = model.data;
        //Code to add to database to go here
        model.message = "Successfully added entry to DB.";
    };
};
```

### __REST Actions__

REST actions parameters are send via the body of a request or query string parameters. Unlike RPC actions REST actions can have parameters defined as part of the URL route.

REST actions can take a parameter template as an assignable value. The template format is :

parameterNameA/parameterNameB

### __ActionREST assignable__

Has Name | Assignable values | Assignable result | Can assign to
-------- | ----------------- | ----------------- | -------------
   ✔    | 2 Strings, 1 function |  actionRPCProxy     | serviceProxy

#### Action Assignable values

String Values | Number Values | Function Values
------------- | ------------- | ---------------
HTTP Verb     | _ | Action function 
URL Parameter Template | _ | _


#### Defining REST actions :

```javascript
//Defines and exports the service module and function
module.exports = (service, server, willcore) => {
   //Action to get data Example URL: https://localhost:8410/serviceName/getData/product/2
   service.getData.actionREST["type/id"].get = async (model) => {
        let type = model.type;
        let id = model.id;
        let dbResult = [];
        //Get database results code to go here
       model.result = dbResult;
    };
    //Request with body and URL parameter
    service.updateData.actionREST["id"].put = async (model) => {
        let id = model.id;
        let newValue = model.value;
        //Update database entry to go here
        model.message = "Record updated.";
    };
};
```


### __Action Aliases__

Sometimes it is required to have two or more actions activated on the same URL. For instance, if you have an action *account/user* and want to get, add, delete and update records, it is possible to have 4 different actions on the same URL if they have different HTTP verbs. This can be accomplished by defining the actions with different names and then afterwards giving the actions aliases.

### __Action assignable__

Has Name | Assignable values | Assignable result | Can assign to
-------- | ----------------- | ----------------- | -------------
   ✔    | _ |  Empty     | actionRESTProxy, actionRPCProxy

#### Action Assignable values

String Values | Number Values | Function Values
------------- | ------------- | ---------------

#### Using Action Aliases

```javascript
module.exports = (service, server, willcore) => {
   //Can be called via URL: https:/localhost/account/user Verb: GET
    service.user.action.get = async (model) => {
       //Code to go here
    };
    //Can be called via URL: https:/localhost/account/user Verb: POST
    service.postUser.action.post = async (model) => {
          //Code to go here
    };
    service.postUser.data.alias;
    //Can be called via URL: https:/localhost/account/user Verb: POST
    service.putUser.action.put = async (model) => {
          //Code to go here
    };
    service.putUser.data.alias;
    //Can be called via URL: https:/localhost/account/user Verb: DELETE
    service.deletetUser.action.delete = async (model) => {
          //Code to go here
    };
    service.deletetUser.data.alias;
};
```

### __Request Interceptors__

Interceptors are functions that intercept and executes a function a request before or after an action is executed or file is returned. This can be used to implement token or cookie based authentication, caching etc. An interceptor can be defined via the interceptor assignable.

### __Interceptor assignable__

Has Name | Assignable values | Assignable result | Can assign to
-------- | ----------------- | ----------------- | -------------
   ✔    | 1 function |  Empty     | actionRESTProxy, actionRPCProxy, fileServerProxy, filesServerProxy -> requestProxy

#### Interceptor Assignable values 

String Values | Number Values | Function Values | Name Values
------------- | ------------- | --------------- | ---------------
_ | _ | _ | before or after

### Action Interceptors

#### Action Interceptor Function Parameters

1. Action Model
2. HTTP(S) Request Instance
3. HTTP(S) Response Instance

When an action interceptor returns falsy, it returns the provided values assigned to the model as well as the assigned HTTP status code. This can be used for instance to block access to an action or cache the result of an action. 

#### Using An Interceptor To Block Access To An Action 

```javascript
module.exports = (service, server, willcore) => {
   //Defines action to get data
    service.getData.action.get = async (model) => {
       model.data = [ { value : "Johanna Doe" } ];
    };
    //Authorization interceptor
    service.getData.before.interceptor = async (model, request, response) => {
       let result = true;
       if (model.user === "JohnDoe"){
         model.statusCode = 501;
         model.error = "Unauthorized";
         result = false;
       }
       return result;
    };
   //Interceptor to add data to the response
   service.getData.after.interceptor = async (model, request, response) => {
      model.server = "WillCore.Server";
      return true;
   };
};

```


#### File Interceptor Function Parameters

1. File Path (before) and file data (for after)
2. HTTP(S) Request Instance
3. HTTP(S) Response Instance

File interceptors differs form action interceptors in the sense that file interceptors will return the result of the interceptor function if the value of the interceptor function's result evaluate to truthy. When the function returns data, the MIME type (response.mimeType) and status code (response.statusCode) needs to be specified on the response.

