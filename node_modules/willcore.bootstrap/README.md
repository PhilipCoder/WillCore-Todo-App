<p align="center">
<img src="res/WillCoreLogo.png"  />
<h1 align="center">WillCore.Bootstrap</h1>
<h5 align="center">Bootstrap assignables for WillCore.UI - By Philip Schoeman</h5>
</p>

## Info

WillCore.Bootstrap contains Bootstrap 4.5 files and assignables. The assignables are wrappers that translate the Bootstrap's JQuery API to WillCore.UI assignables.

For more info on Bootstrap, goto [https://getbootstrap.com/docs/4.5/getting-started/introduction/](https://getbootstrap.com/docs/4.5/getting-started/introduction/).

## Installing

WillCore.Bootstrap can be installed on an existing WillCore.UI project using NPM:

```javascript
npm install willcore.bootstrap
```

## Activating

After installing, the bootstrap module can be activated via the "bootstrap" assignable on a WillCore.UI instance :

```javascript
willcoreInstance.server.ui.bootstrapEndpoint.bootstrap;
```

"bootstrapEndpoint" is the file service name where the Bootstrap files will be served from. This can be changed to avoid clashing with existing file services.

__Full Example:__

```javascript
const willCoreProxy = require("willcore.core");
let willcore = willCoreProxy.new();
willcore.testServer.server[__dirname] = 8581;
willcore.testServer.http;
willcore.testServer.ui;
willcore.testServer.ui.bootstrapFiles.bootstrap;
```

>WillCore.Bootstrap is only activated server-side, no client side activation is required. After activating, Bootstrap will be available and ready to use in your project.

## Components

All components in Bootstrap 4.5 are available to use. Some components require JQuery activation in SPAs. The JavaScript activated components have wrapper assignables to make their use painless.

## Wrapper Assignables

### 1) Carousel

For more documentation on the Bootstrap carousel, please see the Bootstrap documentation, [here](https://getbootstrap.com/docs/4.5/components/carousel/)

_A carousel binding needs the following assignments to complete assignment:_

Type | Description
------------ | -------------
bootstrapCarousel (assignable) | A wrapper assignable for the $().carousel({}) function. 
object | Options Object. This options object is passed to the JQuery carousel function. For more info on the options, see the Bootstrap documentation

__Example__

```html
<!--View HTML-->
<div id="carouselDiv" class="carousel slide" data-ride="carousel">
  <div class="carousel-inner">
    <div class="carousel-item active">
        <img src="..." class="d-block w-100" alt="...">
    </div>
    <div class="carousel-item">
      <img src="..." class="d-block w-100" alt="...">
    </div>
    <div class="carousel-item">
      <img src="..." class="d-block w-100" alt="...">
    </div>
  </div>
</div>
```

```javascript
//View Function
const view = (model) => {
    model.$carouselDiv.bootstrapCarousel = { interval:2000 };
};

export { view };
```

### 2) Dropdowns

For more documentation on the Bootstrap dropdowns, please see the Bootstrap documentation, [here](https://getbootstrap.com/docs/4.5/components/dropdowns/)

_A dropdown binding needs the following assignments to complete assignment:_

Type | Description
------------ | -------------
bootstrapDropdown (assignable) | A wrapper assignable for the $().dropdown({}) function. 
object | Options Object. This options object is passed to the JQuery dropdown function. For more info on the options, see the Bootstrap documentation

Result: { toggle: function }

__Toggling The Dropdown__

After assigning, an object will be available to interact with the dropdown.

__Example__

```html
<!--View HTML-->
 <div class="form-group" style="margin-top:20px">
    <div class="dropdown">
      <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown"
        aria-haspopup="true" aria-expanded="false">
        Dropdown button
      </button>
      <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
        <a class="dropdown-item" href="#">Action</a>
        <a class="dropdown-item" href="#">Another action</a>
        <a class="dropdown-item" href="#">Something else here</a>
      </div>
    </div>
  </div>
```

```javascript
//View Function, create dropdown
const view = (model) => {
    model.$dropdownMenuButton.bootstrapDropdown = {};
};

export { view };
```

```javascript
//View Function, create dropdown and toggle
const view = (model) => {
    model.$dropdownMenuButton.bootstrapDropdown = {};
    model.$dropdownMenuButton.toggle();
};

export { view };
```

### 3) Modals

The modal assignable enables a separate view to be rendered as a bootstrap modal. Values can be returned form the modal view to the parent page.

_A modal binding needs the following assignments to complete assignment:_

>A modal assignable has a name.

Type | Description
------------ | -------------
bootstrapModal (assignable) | A wrapper assignable for a bootstrap modal. 
string | Path to the view. Example: "/views/modal"

Result: { show: function }.

After assigning, an object will be available containing one function, "show" that can be used to activate and show the modal. This function will return a promise that will resolve into the result of the modal. The view function of the modal will have a member function called "close" that can be used to resolve the promise and close the modal. The parameter of the close function will be result of the promise.

Name | Type | Description
------------ | ------------- | ------------ |
modalProperties | Object | The bootstrap options object passed to the $().modal() function.
modelValues | Values | Values that will be passed to the model of the modal. Object's properties will be assigned to the model as data collections.

__Example__

```html
<!--Modal view HTML, "/modals/about.html"-->
<div class="modal" tabindex="-1" role="dialog">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Modal title</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <p>This is the about modal.</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
          <button type="button" class="btn btn-primary" id="saveChanges">Save changes</button>
        </div>
      </div>
    </div>
  </div>
```

```javascript
//Modal view function, "/modals/about.js"
const view = (model) => {
    model.$saveChanges.onclick.event = () => {
        //Close the modal and send result back
        model.close({ message: "result saved"+model.data.message  });
    };
};

export { view };
```

```javascript
//Parent page that opens the modal
const view = (model) => {
    model.$modalContainer.testModal.bootstrapModal = "/modals/about";
    model.$showModal.onclick.event =async () =>{  
        let result = await model.$modalContainer.testModal.show({},{data:{message:"awesome"});
        console.log(result);
    };
};

export { view };
```

### 4) Popovers

For more documentation on the Bootstrap Popovers, please see the Bootstrap documentation, [here](https://getbootstrap.com/docs/4.5/components/popovers/)

_A popover binding needs the following assignments to complete assignment:_

Type | Description
------------ | -------------
bootstrapPopover (assignable) | A wrapper assignable for the $().popover({}) function. 
object | Options Object. This options object is passed to the JQuery popover function. For more info on the options, see the Bootstrap documentation

Result: { toggle: function }

__Toggling The Popover__

After assigning, an object will be available to interact with the popover.

__Example__

```html
<!--View HTML-->
<button class="btn btn-primary" id="popover">Show Popover</button>
```

```javascript
//View Function, create popover
const view = (model) => {
     model.$popover.bootstrapPopover = {content:"This is a popover"};
};

export { view };
```

```javascript
//View Function, create popover and toggle
const view = (model) => {
     model.$popover.bootstrapPopover = {content:"This is a popover"};
    model.$bootstrapPopover.toggle();
};

export { view };
```

### 5) Tooltips

For more documentation on the Bootstrap tooltips, please see the Bootstrap documentation, [here](https://getbootstrap.com/docs/4.5/components/tooltips/)

_A tooltips binding needs the following assignments to complete assignment:_

Type | Description
------------ | -------------
bootstrapTooltip (assignable) | A wrapper assignable for the $().tooltips({}) function. 
object | Options Object. This options object is passed to the JQuery tooltips function. For more info on the options, see the Bootstrap documentation

Result: { toggle: function }

__Toggling The Tooltips__

After assigning, an object will be available to interact with the tooltip.

__Example__

```html
<!--View HTML-->
<button class="btn btn-primary" id="tooltip">Tooltip On This Button</button>
```

```javascript
//View Function, create tooltip
const view = (model) => {
     model.$tooltip.bootstrapTooltip = {title:"This is a tooltip"};
};

export { view };
```

```javascript
//View Function, create tooltip and toggle
const view = (model) => {
      model.$tooltip.bootstrapTooltip = {title:"This is a tooltip"};
    model.$bootstrapPopover.toggle();
};

export { view };
```

### 6) Alerts

Alerts are modals that can prompt the user with message and resolve a promise when the user clicks on the "OK" button. Alerts are assignables on the UI proxy and not on the model of a view or elements. The UI proxy is the second parameter of the view function.

_An alert assignable needs the following assignments to complete assignment:_

Type | Description
------------ | -------------
name | The name of the alert. This is used to return the promise used to resolve the modal close event.
bootstrapAlert (assignable) | A wrapper assignable for the $().modal({}) function. 
string | The heading of the alert modal.
string | The message of the alert modal.

Result: Promise.

```javascript
const view = (model, ui) => {
  ui.myAlert.bootstrapAlert = "Message";
  ui.myAlert = "Hello world!";
  await ui.myAlert;
  console.log("The user closed the alert.");
};

export { view };
```

#### Alert:

![Alert Image](/res/alert.PNG)

### 7) Prompt

Prompts are modals that can prompt the user with message, give an user options and resolve a promise when the user clicks on the buttons. Prompts are assignables on the UI proxy and not on the model of a view or elements. The UI proxy is the second parameter of the view function.

_A prompt assignable needs the following assignments to complete assignment:_

Type | Description
------------ | -------------
name | The name of the alert. This is used to return the promise used to resolve the modal close event.
bootstrapPrompt (assignable) | A wrapper assignable for the $().modal({}) function. 
string | The heading of the prompt modal.
string | The message of the prompt modal.
object | The buttons of the modal.

Result: Promise.

The buttons object is an object where the keys are the names of the buttons and the value is an object with the label of the button and a field indicating if the button is a primary button. For example:

```javascript
{ yes: { label: "Yes", primary: true }, no: { label: "No", primary: false } }
```

#### Example:

```javascript
const view = (model, ui) => {
  ui.myPrompt.bootstrapPrompt = "Message";
  ui.myPrompt = "Hello world!";
  ui.myPrompt = { yes: { label: "Yes", primary: true }, no: { label: "No", primary: false } };
  let result = await ui.myPrompt;
  console.log(`You selected ${result}`);
};

export { view };
```

#### Alert:

![Alert Image](/res/prompt.PNG)

### 8) Toasts

Toasts are temporary modals that self destruct after showing user a message. Toasts are assignables on the UI proxy and not on the model of a view or elements. The UI proxy is the second parameter of the view function.

_A toast assignable needs the following assignments to complete assignment:_

Type | Description
------------ | -------------
bootstrapToast (assignable) | A wrapper assignable for the $().toast({}) function. 
string | The heading of the toast.
string | The message of the toast.
settings | The settings of the toast.

Result: None.

The settings object is an object that have 2 option properties: delay and style:

* Delay is the duration in milliseconds the toast will be visible to the user. The default value is 5000.
* Style is header background style that will be applied to the toast. Valid values are: "info", "success", "warning", "danger" and "default"

For example:

```javascript
{style:"info",delay:4000}
```

#### Example:

```javascript
const view = (model, ui) => {
  ui.bootstrapToast = ["Message", "Hello world!", {style:"info",delay:4000}];
};

export { view };
```

### Styles

#### Info

![Alert Image](/res/toastInfo.PNG)

#### Success

![Alert Image](/res/toastSuccess.PNG)

#### Warning

![Alert Image](/res/toastWarning.PNG)

#### Danger

![Alert Image](/res/toastDanger.PNG)

#### Default

![Alert Image](/res/toastDefault.PNG)