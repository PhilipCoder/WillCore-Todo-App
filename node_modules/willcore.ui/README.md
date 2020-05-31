<p align="center">
<img src="res/WillCoreLogo.png"  />
<h1 align="center">WillCore.UI</h1>
<h5 align="center">Simple, Fast And Powerful Client-Side HTML UI Framework - By Philip Schoeman</h5>
<h5 align="center" style="color:red">DOCUMENTATION IS A WORK IN  PROGRESS.</h5>
</p>

___

> WillCore.UI is a framework that makes building a client-side rendered single paged application easy. Fast and small, but yet powerful, it requires no pre-compilers and everything is coded in ES6. WillCore.UI is an extension on the WillCore.Server framework.

___

### Why Another JavaScript Framework?

With so many JS UI frameworks popping up, it is hard to keep up to date with all the new front-end libraries. Most of them are over complicated, requires pre-compilers, and take ages just to set them up. That is why WillCore.UI was born, a simple but yet powerful framework was needed to not only build websites, but also PWAs with offline functionality.

###### WillCore.UI has a simple API and can be learned in a day (disclaimer: excluding people with impaired cognitive functionality). 

<br/>

___
> ## Index
___

1. [Assignable Introduction](#1-Assignable-Introduction)
2. [Getting Started](#2-Getting-Started)
3. [Views And Routing](#3-Views-And-Routing)
4. [Data Proxies](#4-Data-Proxies)
5. [Data Bindings](#5-Data-Bindings)
   1. [Model](#5.1-Model)
   2. [Bind](#5.2-Bind-(InnerHTML))
   3. [Repeat](#5.3-Repeat)
   4. [Events](#5.4-Events)
   5. [Attributes](#5.5-Attributes)
   6. [Select Options](#5.6-Select-Options)
   7. [Disabled](#5.7-Disabled)
   8. [Hide](#5.8-Hide)
   9. [Show](#5.9-Show)
   10. [Style](#5.10-Style)
   11. [Class](#5.11-Class)
   12. [Partial Views](#5.12-Partial-Views)
9. [Adding meta tags, CSS and JavaScript to the HTML document](#6-Adding-CSS-and-JavaScript-to-the-HTML-document)
7. [Custom Components](#7-Custom-Components)
8. [Making Server Requests From The Front-End](#8-Making-Server-Requests-From-The-Front-End)
9. [View Access](#9-View-Access)
10. [Global Events](#10-Global-Events)
11. [Built In Events](#11-Built-In-Events)
    1. [Navigate Event](#Navigate-Event)

<br/>

___
> ## 1 Assignable-Introduction
___

In order to make the API as simple as possible, WC.UI (WillCore.UI) uses the concept of assignables to instantiate and assign state to internal objects. The concept might be a bit weird at first, but it simplifies the API.

<br/>

E1) Let's take the following example:

```javascript
//Creates an instance of the attribute class and assign values to it.
view.$elementId.attribute = new attribute(view);
//Assign the attributeField property on the instance
view.$elementId.attribute.attributeField = "style";
//Assign the value function on the attribute instance
view.$elementId.attribute.valueFunction = () => ({ color: "red" });
```

In the example above we use traditional Class or Function instantiation and then we assign properties to the instance. But by doing so we are expecting the programmer to know the API and what values to assign. But what if the class itself knew what values to assign where? That is where assignables come in.

<br/>

E2) Doing it the assignable way:

```javascript
//Assigning the class "attribute", the framework knows how to create an instance and where it should live.
view.$elementId = attribute;
//Assigning the attribute field to the attribute.
view.$elementId = "style";
//Assigning the value function.
view.$elementId = () => ({ color: "red" });
```
<br/>

>The two examples above do the exact same thing. 
When the class is assigned to $elementId, the framework checks if the class inherits from an assignable. Then it creates an instance of the attribute class. The instance of the attribute class then tells WillCore.UI that it needs 1 string and 1 function to complete assignment. When the string and function is assigned, the attribute class initiates itself and the instance is removed from 
the $elementId object.

<br/>

E3) Dot notation can be used on the assignable and string fields:

```javascript
view.$elementId.attribute.style = () => ({ color: "red" });
```
<br/>

Examples 2 and 3 do the same thing. Assignables are the core of WillCore.UI's API and all interaction with the framework is done via assignables.

<br/>

___
>## 2 Getting Started
___

WillCore.UI can be installed via an NPM package. Make a new directory and install the module into the directory:

```javascript
npm install willcore.ui
```

WillCore.UI is an extension on WillCore.Server. For documentation on WillCore.Server see the [github repo](https://github.com/PhilipCoder/willcore.server).

#### To create a server

> #### Important: Keep in mind that when files are being served, all files including server-side file will be served. To block files being served, make sure that there is "_server" included in the file path. Either put the server files in a folder named *_server or name the files *_server. Example: /services_server/products.js or /services/products_server.js.

The basic folder structure of a WillCore.UI project:

```text
|─── Project Directory
|    |─── client
|    |─── app.js
|    |─── index.js
|    |─── index.html
|    |─── services_server
|─── server_server.js
```

#### Create a server_server.js file in the project root directory:

```javascript
//server_server.js
//Import the WillCore Proxy.
const willCoreProxy = require("willcore.core");
//Create a new proxy instance.
let core = willCoreProxy.new()
//Create an http server on port 8580 executing in the client directory;
core.testServer.server[`${__dirname}/client`] = 8580;
core.testServer.http;
//Load the UI framework.
core.testServer.ui;
```

#### Create an app.js client-side entry point:

The app.js module should export an function named init. This function will execute when the client side app loads.

```javascript
let init = (willcore) => {
    //Loads the client side library
    willcore.ui;
};
//Export the function using ES6 export
export { init };
```

#### Create an index.html file in the client folder:

```html
<h1 id="heading"></h1>
```

#### Create an index.js file in the client folder:

```javascript
//The view function
let view = async (model) => {
    //Create a data collection called data
    model.data = { toBind: "Hello World" };
    //Binds the heading to the "toBind" property on the data set
    model.$heading.bind = () => model.data.toBind;
};
//Exports the view function
export {view};
```

<br/>

___
>## 3 Views And Routing
___

WillCore.UI views are rendered into a built up HTML document and consists of a JavaScript module and HTML file. The HTML file and JavaScript files should have the same name, only the extensions differ. For instance a view "home" should have a "home.js" and "home.html" file in the same directory.

>### 3.1) The HTML file

The HTML file excludes the HTML page, header and body tags. All elements that are accessed through JavaScript should have IDs.

#### Example of a "Hello World" view file

```html
<label>Hello World</label>
```

>### 3.2) The view module.

The view module is file that exports a function named "view". The first parameter of the view function is the view model. This function will be executed when the view is activated and loaded.

```javascript
//The view function
let view = async (model) => {
};
//Exports the view function
export {view};
```

>### 3.3) Routing


Routing is done via the hash URL of the site. By default the home hash route "/" will load the index view in the root directory. To load a view about in the root directory the hash URL will be '/about'. Views can be multiple directories deep. For instance to load a view named register in the /views/account folder, the URL will be "/views/account/register". Views will load when the hash URL changes. 

Views can have parameters in their hash URLs. "/account?id=90&action=delete" will have two parameters id with value 90 and action with value "delete". View parameters can be accessed via the parameters object on the location assignable on the model.

#### The location object on the model contains the following fields:


name | Type | Description
------------ | ------------ | -------------
url | string | The full path to the loaded view, excluding the parameters.
name | string | The name of the current view in the hash URL.
parameters | object | Object containing the parameters for the current hash URL.
navigate | function(viewPath, viewParameters) | A navigation function that can be used to navigate to a view.

#### Accessing view parameters

```javascript
//The view function
let view = async (model) => {
    //Alert the view parameters
    alert(`The id parameter is ${model.location.parameters.id} and the action parameter is ${model.location.parameters.action}.`);
};
//Exports the view function
export {view};
```

The hash URL can be set via the navigate function on the location assignable. The first parameter is the view location and the second parameter is the view parameters.

#### To navigate to "/account/manage?id=90&action=delete"

```javascript
//The view function
let view = async (model) => {
    //Navigate to the manage account view.
    model.location.navigate("/account/manage",{id:90, action:"delete"});
};
//Exports the view function
export {view};
```

>### 5) View Layouts

By default views are appended to the body of the HTML page. There are cases where more complicated or different layouts for views are needed. For example, a login page has no navigation bar, but a home page might have. This is where layouts come in.

 When a layout is assigned to a view, it will be activated when the router activates the view using the layout.

Layouts supports all the functionality normal views support like model binding and events.

When a view module also export an container ID, the view module will be treated as a layout view. The containerId is the element ID the layout's child view will be rendered into.

<br/>

#### The layout view files (layoutView.html):

```html
<div style="display: flex;flex-direction: column;flex: 1;">
    <div style="display: flex;flex-direction: column;flex: 1;">
        <h1>Layout View</h1>
    </div>
    <div style="display: flex;flex-direction: column;flex: 1;" id="container">
    </div>
</div>
```

<br/>

#### (layoutView.js)

```javascript
let view = async (model) => {
};

let containerId = "container";

export {view, containerId};
```

<br/>

#### Rendering a view in a layout

```javascript
let view = async (model) => {
};


let layout = "/layoutFolder/layoutView"

export { view, layout };
```

<br/>

___
>## 4 Data Proxies
___

Data proxies are objects that triggers events when data on them changes. They are the core of the model-binding functionality of WillCore.UI. To create a data proxy, simply assign an object or array containing the data to a property on a view's model. All objects and arrays will be converted into data proxies. Data proxies can be multi-layer deep and when an object is assigned to a data proxy as a child, it will also be converted into a data proxy.

```javascript
//The view function
let view = async (model) => {
    //Create a data proxy called data
    model.personData = { 
        firstName: "John", 
        surname:"Doe", 
        telephone: 
            {
                areaCode:"0026", 
                number:"6547833"
            }
        };
};
//Exports the view function
export {view};
```

<br/>

___
>## 5 Data Bindings
___

WillCore.UI supports model binding between HTML elements and JavaScript state. A proxy engine is used instead of observables and instead of a virtual DOM, the DOM is accessed directly via HTML IDs. The lack of all this unnecessary complexity makes WillCore.UI fast, very fast.

Every HTML file's HTML elements can only be accessed by it's module. HTML IDs are unique for every HTML file, so even if the layout of a view and the view have a elements with the same ID, they won't clash. However, WillCore.UI will output an error if two elements with the same ID are detected in the same HTML file.

In order to bind an element to a JavaScript variable, that variable should be on a data proxy. To bind an element's (with ID nameLabel) inner HTML to a string:

```javascript
var view = async (view) => {
    //Create an collection with a bindable field.
    view.userData = { userName : "John Doe" };
    //Bind the inner HTML of the element to the field on the collection
    view.$nameLabel.bind = () => view.userData.userName;
};

export { view };
```

___
>**___Binding To Conditional Results___**
>
>WillCore.UI bindings work by indexing data proxies to the binding functions. When a value changes on a data proxy, the framework knows exactly what HTML elements to update. When a binding is defined, all data proxies on the view are instructed to "start listening". The binding function is executed and the data proxies will then report when values are accessed on them. When the values are accessed the binding is indexed. This can cause some issues 
>when conditional results are returned from the function. 
>
>Take a look at this statement **() => model.someCollection.isLoggedIn || model.someCollection.user ? "Hello" : "Bey";**. When isLoggedIn is true, only loggedInMessage will be accessed from the data proxy, so the binding will only be keyed on one key while there should be two. So the binding will only update when isLoggedIn changes and will ignore changes in the user field. They way to get around this limitation, is to use default parameters:
>
>**(isLoggedIn = view.someCollection.isLoggedIn, user = view.someCollection.user) => isLoggedIn || user ? "Hello" : "Bey";**



___
>#### Different Bindings
___

>##### 5.1 Model

The model binding is an unique binding in the sense that it provides bi-directional model binding. An example of bi-directional model binding is when a string field is bound to an input. The property changes when the value of the input changes, and the input changes when the property changes. The input's value will always be the same as the property.

_A model binding needs the following assignments to complete assignment:_

Type | Description
------------ | -------------
model (assignable) | The model assignable exported from the main willCore module. 
function | The binding function that should return the value of the property or properties the binding is bound to.

_Using the model binding:_
```javascript
model.$elementId.model = () => model.dataProxy.someProperty;
```

<br/>


>##### 5.2 Bind (InnerHTML)

The bind binding binds an element's inner HTML to a field or function result. It a one way binding.

_A bind binding needs the following assignments to complete assignment:_

Type | Description
------------ | -------------
bind (assignable) | The bind assignable exported from the main willCore module. 
function | The binding function that should return the value of the property or properties the binding is bound to.

_Using the model binding:_
```javascript
model.$elementId.bind = () => model.dataProxy.someProperty;
```

<br/>


>##### 5.3 Repeat

The repeat binding binds an element to an array. The element with it's children will be duplicated for every item in the array. An iterator function can be used to bind the children of the element. A temporary proxy is passed to the iterator function that can be used for the binding of the child elements.

_A repeat binding needs the following assignments to complete assignment:_

Type | Description
------------ | -------------
repeat (assignable) | The repeat assignable exported from the main willCore module. 
function | The binding function that should return the value of the property or properties the binding is binded to.

The repeat function takes 2 parameters:

Parameter | Description
------------ | -------------
elements |  A proxy instance that can be used to access the current instance of the repeated HTML element's child elements. Can be used the same way as a model, but no collections can be defined on it.
index | As the iterator loops through the array, the index parameter will be the current index in the array.

_HTML_

```html
<div id="categoryCard">
    <h3 id="title"></h3>
    <div id="description"></div>
    <hr />
    <button id="editCategory">Edit</button>
</div>
```

_Using the model binding:_

```javascript
//An array collection
model.categories = [
    {id: 1, name: "First Category", description: "Since it is the first category, it is the best."},
    {id: 2, name: "Second Category", description: "This category is last. It sucks."}
;
//Define the repeat binding.
model.$categoryCard.repeat = () => model.categories;
//Initiate the repeat binding
 model.$categoryCard.repeat = (elements, rowIndex) => {
        elements.$title.bind = () => model.categories[rowIndex].name;
        elements.$description.bind = () => model.categories[rowIndex].description;
        elements.$editCategory.onclick.event = () => {
            alert(`Item with ID ${model.categories[rowIndex].id} clicked!`);
        };
 };
```

<br/>

___
>#### **Important!**
>Array's size and order is immutable in willCore. Meaning it can not be changed.In order to sort an array collection, first make a shallow copy of the array, sort the copy of the array and then overwrite the collection with the instance of the array. Same goes for adding new items in an array collection.
___


>##### 5.4 Events

HTML events are all handled via the event assignable. The events have the same name than in vanilla JavaScript. For example, onclick.

_An even binding needs the following assignments to complete assignment:_

Type | Description
------------ | -------------
string | The event name. For a list of events, see JavaScript HTML events by means of using Google.
event (assignable) | The event assignable exported from the main willCore module.
function | The function will be executed when the event is detected. The function has one parameter that will be the javascript event.

_Using the model binding:_
```javascript
model.$elementId.onclick.event= (event) => alert("The item was clicked!");
```

<br/>

>##### 5.5 Attributes

All attributes on a HTML element can be binded to values. Attribute bindings like, class, href, disabled etc. are all supported

_An attribute binding needs the following assignments to complete assignment:_

Type | Description
------------ | -------------
string | The attribute name.
attribute (assignable) | The attribute assignable exported from the main willCore module. 
function | The binding function used to get the values of the attribute. The function should return a string value that will be applied to the attribute.

_Using the attribute binding to bind a disabled state:_
```javascript
model.$elementId.disabled.attribute = () => model.userData.isLoggedIn;
```

<br/>

>##### 5.6 Select Options

The options in a select dropdown can be bound to a data proxy with the options binding. The data proxy values can be either an object or multidimensional array.

_A options binding needs the following assignments to complete assignment:_

Type | Description
------------ | -------------
options (assignable) | The options assignable exported from the main willCore module. 
function | The function that can return either an object or multi dimensional array.

_Using the options binding to bind to an object:_

When binding to an object, the property name will translate into the label of the option and the value of the property will result in the value of the option.

```javascript
model.myData = {genders: { Male: "male", Female: "female" }};
model.$dropdown.options = () => model.myData.genders;
```

_Using the options binding to bind to a multidimensional array:_

When binding to an array of arrays, the second item will translate into the label of the option and the first item will result in the value of the option.

```javascript
model.myData = {genders: [["Male", "male"], ["Female", "female" ]]};
model.$dropdown.options = () => model.myData.genders;
```

_Using the options binding with the model binding:_

The options binding can be used with the model binding to bind the selected option to a value on a value proxy.

```javascript
model.myData = {
        genders: [["Male", "male"], ["Female", "female" ]],  
        gender: null
    };
model.$dropdown.options = () => model.myData.genders;
model.$dropdown.model = () => model.myData.gender;
```

<br/>

>##### 5.7 Disabled

The disabled binding binds an element's disabled attribute to a field or function result. It a one way binding.

_A disabled binding needs the following assignments to complete assignment:_

Type | Description
------------ | -------------
disabled (assignable) | The disabled assignable. 
function | The binding function that should return the value of the property or properties the binding is bound to. The result should translate to true or false.

_Using the model binding:_
```javascript
model.$submitButton.disabled = () => model.myData.name.length > 10;
```

<br/>

>##### 5.8 Hide

The hide binding binds an element's hidden status to a field or function result. It a one way binding.

_A hide binding needs the following assignments to complete assignment:_

Type | Description
------------ | -------------
hide (assignable) | The hide assignable. 
function | The binding function that should return the value of the property or properties the binding is bound to. The result should translate to true or false.

_Using the model binding:_
```javascript
model.$submitButton.hide = () => model.myData.name.length > 10;
```
<br/>

>##### 5.9 Show

The show binding binds an element's hidden status to a field or function result. It a one way binding.

_A show binding needs the following assignments to complete assignment:_

Type | Description
------------ | -------------
show (assignable) | The show assignable. 
function | The binding function that should return the value of the property or properties the binding is bound to. The result should translate to true or false.

_Using the model binding:_
```javascript
model.$submitButton.show = () => model.myData.name.length > 10;
```

<br/>

>##### 5.10 Style

The style binding binds an element's css style to a field or function result. It a one way binding.

_A style binding needs the following assignments to complete assignment:_

Type | Description
------------ | -------------
string | The css style to be bound.
style (assignable) | The style assignable. 
function | The binding function that should return the value of the property or properties the binding is bound to.

_Using the style binding:_
```javascript
model.$dropdown.backgroundColor.style = () => model.myData.gender === "male" ? "lightblue" :"pink";
```

<br/>

>##### 5.11 Class

The class binding binds an element's css class to a field or function result. It a one way binding.

_A style binding needs the following assignments to complete assignment:_

Type | Description
------------ | -------------
string | The css class to be bound.
class (assignable) | The class assignable. 
function | The binding function that should return the value of the property or properties the binding is bound to. The result should translate to true or false.

_Using the style binding:_
```javascript
model.$nameInput.invalid.class = () => model.myData.name.length === 0;
```

<br/>

>##### 5.12 Partial Views

Views can be loaded into a view as child or partial views. Data proxies can be assigned to a partial view from the parent view. After a partial view is loaded, it's model can be accessed via the callback function.

_An partial view binding needs the following assignments to complete assignment:_

Type | Description
------------ | -------------
view (assignable) | The view assignable.
string | Path to the view.
function | Callback for when the partial view is done loading. It takes one parameter that will be the model of the partial view.

_Using the model binding:_
```javascript
model.$partialDiv.view = "/zView/partial";
//Callback for when the view is done loading
model.$partialDiv.view = (clientModel) => {
    //Changes a property on a data proxy inside the child partial view.
    window.setTimeout(() => {
        clientModel.data.value = "5 Seconds Passed.";
    }, 5000);
};
```

<br/>

___
>## 6 Adding meta tags CSS and JavaScript to the HTML document
___

WillCore.UI builds up the HTML header tag, so it is not possible to include HTML and CSS files directly in the HTML. The header is built using the script and style cache in the server-side assignable.

>#### 6.1) Adding A CSS Style File To The Page

HTML meta tags can be added to the page via the metaTag assignable. There are 2 default meta tags, as soon as a meta tag is assigned, the default assignables will be cleared. Default meta tags:

```html
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
```

_A metaTag assignable needs the following assignments to complete assignment:_

Type | Description
------------ | -------------
string | The name of the tag.
metaTag (assignable) | The tag assignable.
string | The meta tag;

```javascript
//Create the server
const willCoreProxy = require("willcore.core");
let core = willCoreProxy.new();
core.testServer.server[__dirname] = 8580;
core.testServer.http;
core.testServer.ui;
//Add a CSS style file to the server
core.testServer.viewport.metaTag = '<meta name="viewport" content="width=device-width, initial-scale=2, shrink-to-fit=no">';
```

>#### 6.2) Adding A CSS Style File To The Page

A style file can be assigned to the server via the style assignable.

_A style assignable needs the following assignments to complete assignment:_

Type | Description
------------ | -------------
string | The name of the file.
style (assignable) | The style assignable.
string | The file's path relative to the server's executing directory.

```javascript
//Create the server
const willCoreProxy = require("willcore.core");
let core = willCoreProxy.new();
core.testServer.server[__dirname] = 8580;
core.testServer.http;
core.testServer.ui;
//Add a CSS style file to the server
core.testServer.bootstrapStyle.style = "/css/BootStrap.css";
```

>#### 6.3) Adding A JavaScript File To The Page

A script file can be assigned to the server via the script assignable.

_A script assignable needs the following assignments to complete assignment:_

Type | Description
------------ | -------------
string | The name of the file.
script (assignable) | The script assignable.
string | The file's path relative to the server's executing directory.

```javascript
//Create the server
const willCoreProxy = require("willcore.core");
let core = willCoreProxy.new();
core.testServer.server[__dirname] = 8580;
core.testServer.http;
core.testServer.ui;
//Add a JavaScript file to the server
core.testServer.bootstrapScript.script = "/libraries/BootStrap.js";
```

>#### 6.4) Adding A JavaScript Module File To The Page

A script file of type "module" can be assigned to the server via the script assignable.

_A scriptModule assignable needs the following assignments to complete assignment:_

Type | Description
------------ | -------------
string | The name of the file.
scriptModule (assignable) | The scriptModule assignable.
string | The file's path relative to the server's executing directory.

```javascript
//Create the server
const willCoreProxy = require("willcore.core");
let core = willCoreProxy.new();
core.testServer.server[__dirname] = 8580;
core.testServer.http;
core.testServer.ui;
//Add a JavaScript file of type module to the server
core.testServer.myComponent.scriptModule = "/libraries/myComponent.js";
```

<br/>

___
>## 7 Custom Components
___

Custom components in WillCore.UI combine the power of HTML web components with the easy of use proxy model binding. Custom elements allows you to define new element tags.

A custom element consists out of 3 parts:

* Element class
* HTML template
* View Function

>### Element Class

The element class is a class that inherits from the coreElement class available at _"/uiModules/components/coreElement.js"_. This is the class that defines the web component to the browser. The configuration of the element is done on an instance of the elementCreationConfig class available at _"/uiModules/components/elementCreationConfig.js"_.

#### API (Element Class)

Base Location : /uiModules/components/coreElement.js

| Method | Parameters | Description |
| ------ | ---------- | ----------- |
| constructor(config) | config : elementCreationConfig | The constructor should call the base constructor with an instance of a elementCreationConfig class |
| onLoaded() | None | A callback that will be executed after the element is appended to the DOM and the view function is done executing |
| register(elementName) | elementName : String | Method to register the component with an element name in the browser. The name provided will be the HTML tag used to create the element |
| view(model) | Function | The view function of the component. Takes a model and request proxy as parameters. |

#### API (Configuration Class)

Location : /uiModules/components/elementCreationConfig.js

| Method | Parameters | Description |
| ------ | ---------- | ----------- |
| constructor() | None | Creates an instance of the class |
| html | String | The HTML string of the template. When the template is in another file, htmlTemplateURL should be used |
| htmlTemplateURL | String | The path to the HTML template. The html property can be used instead if the template is not in another file. |

>### Example: Custom Button

In this example we create a custom button element that displays the amount of times an user clicked on it and it turns from blue to red when an user clicked more that 10 times. Lets name it clicker-button.

#### clickerButton.js

```javascript
import { coreElement } from "/uiModules/components/coreElement.js"; //Get the base class we need to extend
import { elementCreationConfig } from "/uiModules/components/elementCreationConfig.js"; //Get the configuration needed.

//Define the configuration for the element
const conf = new elementCreationConfig();
conf.html = `<button id="button"><span id="label"></span></button>`;

class clickerButton extends coreElement {
    constructor() {
        super(conf)
    }
    //The elements view function
    async view(model){
        //Creates a data proxy with a single property called clickCount
        model.data = { clickCount: 0 };
        //Binds the buttons innerHTML to the click count on the data proxy.
        model.$label.bind = () => `Clicked : ${model.data.clickCount}`;
        //Increments the click count every time the user clicks on the button.
        model.$button.onclick.event = () => { model.data.clickCount++ };
        //Changes the buttons background color depending on the click count.
        model.$button.backgroundColor.style = () => model.data.clickCount > 10 ? "red" : "blue";
    };
}

//Registers the element into the browser.
clickerButton.register("clicker-button");

export { loaderButton };
```

>### Adding the JavaScript module file to the page.

To add the module to the included modules, it needs to be added to the list of script files __server-side__.

```javascript
willCoreInstance.serverName.clickerButton.scriptModule = "/views/elements/clickerButton.js";
```

_The component can be registered by an assignable in an WillCore.UI extension module._

>### Using The Component

The component can be rendered in the HTML by using the defined HTML tag.

```html
<loader-button> </loader-button>
```

The custom control will be rendered:

![Custom Button](/res/clickerBTN.PNG)

>### Accessing A Components Model From A Parent View

The viewModel of a component can be accessed from a parent view by calling the viewModel property on the element proxy. The viewModel property is a promise that will resolve once the element's view function is done executing.

```html
<!--HTML-->
<loader-button id="myLoaderBtn"> </loader-button>
```

```javascript 
//Parent view function
//Changing the click count from outside the element.
await model.$customElement.viewModel;
model.$customElement.viewModel.data.clickCount = 100;
```

>### Template Slots

There are cases when you want to keep the child components of the custom element. For this task, you can use the element's slot. The way that WillCore.UI renders the custom elements, the child elements will be loaded before the parent elements. This allows you to configure a parent element according to the child elements.

When an element with an ID of "slot" is present in the element's template HTML, the contents of the element will be moved to the slot element.

Let's change our original example to show the children of the element inside the button next to the click counter.

#### clickerButton.js

```javascript
import { coreElement } from "/uiModules/components/coreElement.js"; //Get the base class we need to extend
import { elementCreationConfig } from "/uiModules/components/elementCreationConfig.js"; //Get the configuration needed.

//Define the configuration for the element
const conf = new elementCreationConfig();
//Specify a template with a slot
conf.html = `<button id="button"><span id="label"></span><span id="slot"></span></button>`;

class clickerButton extends coreElement {
    constructor() {
        super(conf)
    }
    //The elements view function
    async view(model){
        //Creates a data proxy with a single property called clickCount
        model.data = { clickCount: 0 };
        //Binds the buttons innerHTML to the click count on the data proxy.
        model.$label.bind = () => `Clicked : ${model.data.clickCount}`;
        //Increments the click count every time the user clicks on the button.
        model.$button.onclick.event = () => { model.data.clickCount++ };
        //Changes the buttons background color depending on the click count.
        model.$button.backgroundColor.style = () => model.data.clickCount > 10 ? "red" : "blue";
    };
}

//Registers the element into the browser.
clickerButton.register("clicker-button");

export { loaderButton };
```

Using the custom element.

```html
<loader-button id="customElement">
    <span style="color: red;">Click me</span>
</loader-button>
```

The custom control will be rendered with the children:

![Custom Button](/res/clickerBTNB.PNG)

<br/>

___
>## 8 Making Server Requests From The Front-End
___

Since WillCore.UI uses WillCore.Server as a back-end, it is easy to define server-side web-services that can be called from the font-end. WillCore.UI provides a simple to use proxy that can be used to make HTTP requests.

A request proxy is available as a third parameter on the view function. The proxy currently only supports RPC actions, but REST functionality is in development. A function returned when activating the get traps on the request proxy in the following order:

__requestProxy.serviceName.actionName.httpVerb__

The function returned takes the query parameters in the case of a GET or DELETE and request body in the case of a POST as an object parameter.

#### Lets Define Actions:

```javascript
//product.js (service module)
module.exports = (service, server, willcore) => {
    service.getData.action.get = async (model) => {
        let result = model.id === 0 ? [{name:"Item One"},{name:"Item two"}] : [];
        model.result = result;
    };
    service.addData.action.post = async (model) => {
        model.result = {message:`Data addded! From server: ${model.message}`};
    };
};
```

#### And A Service:

```javascript
 willcoreInstance.serverName.products.service = "/product.js";
```

>#### Calling The Service

To call the get action and return data:

```javascript
let view = async (model,uiProxy, requests) => {
    console.log(await requests.products.getData.get({ id: 0 }));//Will return an object: {result: [{name:"Item One"},{name:"Item two"}]}
    console.log(await requests.products.getData.get({ id: 1 }));//Will return an array {result: []}

    console.log(await requests.products.addData.post({ message: "Hello world" }));//Will return an object {result: { message: "Data addded! From server: Hello World" }}
};

export { view };
```

<br/>

___
>## 9 View Access
___

To block user access to views, an async access function can be returned from a view module. The result of this function will indicate the following:

* When the function returns true, access is granted to the view.
* When the function returns false, access is blocked and no the destination view won't load.
* When the result is a string, the page will navigate to the URL returned by the function.

The first parameter of this function is the WillCore proxy instance and the second parameter is an request proxy. 

#### Allow Access

```javascript
let viewFunction = async (model) => {
};

export  let view = viewFunction, access = (willcore, requestProxy) => true;
```


#### Deny Access

```javascript
let viewFunction = async (model, requestProxy) => {
};

export  let view = viewFunction, access = async (willcore, requestProxy) => false;
```

#### Deny Access And Redirect To Another View

```javascript
let viewFunction = async (model, requestProxy) => {
};

export  let view = viewFunction, access = async (willcore, requestProxy) => "/views/accessDenied";
```

___
>## 10 Global Events
___

WillCore.UI has a built in event system that allows you to send messages and trigger events between views. An event is referenced by name, and a view can subscribe to an event. When a view is unloaded, for instance when the URL changes and a user navigates away from the view, all events associated with that view will be unsubscribed.

An event proxy is available as a fourth parameter in a view function. You can subscribe to an event by assigning a function to a property with the name of the event on the event proxy. An event can be emitted by assigning a value other than a function to the event property. All event subscribers that are subscribed to the event will be executed on all active views.

#### Subscribing To An Event

```javascript
//Defining a view function
let view = async (model, ui, requests, events) => {
    //Subscribing to an event
    events.accessChanged = (eventData) =>{
        alert(`Event accessChanged was fired with data ${JSON.stringify(eventData)}`);
    };
}
export { view };
```

#### Emitting An Event

```javascript
//Defining a view function
let view = async (model, ui, requests, events) => {
    //Subscribing to an event
    events.accessChanged = {message:"This value can be anything!"};
}
export { view };
```

___
>## 11 Built In Events
___

### Navigate Event

By default an event "navigate" is available that will be fired when the hash URL changes of the view. The event data is an object with the following fields:

name | Type | Description
------------ | ------------ | -------------
url | string | The full path to the loaded view, excluding the parameters.
name | string | The name of the current view in the hash URL.
parameters | object | Object containing the parameters for the current hash URL.

#### Keep the location data proxy updated in a layout view:

```javascript
let view = async (model, ui, requests, events) => {
    //Bind an element to the current view name
    model.$currentPage.bind = () => model.location.name;
    //Updates the view name when the url changes
    events.navigate = (values) => {
        model.location.name = values.name;
    };
};

let containerId = "container";

export { view, containerId };
```