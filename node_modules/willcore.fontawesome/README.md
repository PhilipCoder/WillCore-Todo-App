<p align="center">
<img src="res/WillCoreLogo.png" />
<h1 align="center">WillCore.FontAwesome</h1>
<h5 align="center">Font Awesome assignables for WillCore.UI - By Philip Schoeman</h5>
</p>

## Info

WillCore.FontAwesome contains Font Awesome style and font files and assignables. 

For more info on Font Awesome, goto [https://fontawesome.com/icons?d=gallery](https://fontawesome.com/icons?d=gallery).

## Installing

WillCore.FontAwesome can be installed on an existing WillCore.UI project using NPM:

```javascript
npm install willcore.fontawesome
```

## Activating

After installing, the FontAwesome module can be activated via the "fontawesome" assignable on a WillCore.UI instance :

```javascript
willcoreInstance.server.ui.fontAwesomeEndpoint.fontawesome;
```

"fontAwesomeEndpoint" is the file service name where the Font Awesome files will be served from. This can be changed to avoid clashing with existing file services.

__Full Example:__

```javascript
const willCoreProxy = require("willcore.core");
let willcore = willCoreProxy.new();
willcore.testServer.server[__dirname] = 8581;
willcore.testServer.http;
willcore.testServer.ui;
willcore.testServer.ui.fontawesomeEndpoint.fontawesome;
```

>WillCore.fontawesome is only activated server-side, no client side activation is required. After activating, Font Awesome will be available and ready to use in your project.
