<p align="center">
<img src="res/WillCoreLogo.png"  />
<h1 align="center">WillCore.Core</h1>
<h5 align="center">Build With Proxies - By Philip Schoeman</h5>
</p>

___
### A) Assignable-Introduction
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

<br/>

### Adding additional assignables