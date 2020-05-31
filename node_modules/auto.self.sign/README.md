# Auto Self Sign
Author: Philip Schoeman

License: MIT

Please note that this package contains the binaries of MKCert and OpenSSL. The OpenSSL binary requires the Visual Studio Runtime in order to run.
____

> Auto Self Sign is a NodeJS package that creates, installs and serve self-signed certificates for **Windows**. It allows to you develop on HTTPS easily.

## Features:

* Does everything for you with a single API call.
    * Creates a PKCS12 certificate.
    * Installs the certificate into Windows as a "Trusted Root Certification Authority".
    * Extract the X.509 certificate and private key from the PKCS12 certificate.

## Installing

Install via NPM :
```javascript
npm install auto.self.sign
```

## Using
**Important: Since Auto Self Sign installs the certificate into Windows, you need to run as administrator. For example, if Visual Studio Code is used, you need to run VSCode as administrator, or else the certificate won't be able to be installed into windows.**

#### Importing Auto Self Sign :

```javascript
const autoSelfSign = require("auto.self.sign");
```

#### Configuring :

The package exports a configuration object that should be used to configure the certificate generation

```javascript
const autoSelfSign = require("auto.self.sign");
const path = require("path");

//Get the config object from the package
let config = autoSelfSign.config;

//Setting the directory where the certificates should be saved in 
config.certificateFolder = path.join(__dirname, "certificates");
```

##### Configuration Options :

Property | Type | Description
------------ | ------------- | -------------
certificateFolder | String (required) | An absolute path to an existing directory where the self-signed certificates will be saved in.
installCertWindows | Boolean (optional, default : true) | Sets if the certificate should be installed in Windows after it is created.
pkcs12CertFileName | String (Optional, default : "certP12") | Sets the name of the PKCS12 certificate, please note that this excludes the extension.
certFileName | String (Optional, default : "cert") | Sets the name of the X.509 certificate, please note that this excludes the extension.
pkcs12CertFileName | String (Optional, default : "key") | Sets the name of the X.509 key file, please note that this excludes the extension.

#### Installing and getting the certificate and private key :

Method | Parameter | Result
------------ | ------------- | -------------
autoSelfSign(config) | object | object : certGenerationResult { key : String, cert : string, certStatsPKCS12 }

Certificate generation result fields :

Property | Type | Description
------------ | ------------- | -------------
cert | String | The X.509 certificate. 
key | String | The X.509 private key.
pkcs12GenerationResult | Array< String > | The output result and errors of the MKCert utility's PKCS12 certificate generation.
certInstallationResult | Array< String > | The out put and errors of CERTUTIL certificate generation.

The certificate can be generated, installed and by calling the autoSelfSign method.

```javascript
const autoSelfSign = require("auto.self.sign");
const path = require("path");

(async () => {
    //Get the config object from the package
    let config = autoSelfSign.config;

    //Setting the directory where the certificates should be saved in 
    config.certificateFolder = path.join(__dirname, "certificates");

    //Generates and returns the generated certificate.
    let generationResult = await autoSelfSign.autoSelfSign(config);
})();
```

#### Creating an HTTPS server

This example creates a HTTPS server and opens chrome to view the result:

```javascript
const autoSelfSign = require("auto.self.sign");
const path = require("path");
const https = require("https");
const exec = require('child_process').exec

(async () => {
    //Get the config object from the package
    let config = autoSelfSign.config;

    //Setting the directory where the certificates should be saved in. Directory should exist
    config.certificateFolder = path.join(__dirname, "certificates");

    //Generate certificate
    let generationResult = await autoSelfSign.autoSelfSign(config);
        
    //create HTTPS server
    let serverRequest = function (request, response) {
        response.writeHead("200");
        response.end("Test SSL response");
    }
    const options = {
        key: generationResult.key,
        cert: generationResult.cert
    };
    let server = https.createServer(options, serverRequest).listen(8580);

    //open chrome
    exec('start chrome https://localhost:8580', function (err) { });
})();
```

When running the example, you will be greeted with a secure https site. If it does not work, you can inspect the certificate generation result for errors.

<img src="res/secured.png"  />

## Trouble shooting

### **No certificates were generated in the provided certificate folder?**

Make sure to run your application and IDE as administrator. Also check the pkcs12GenerationResult property and certInstallationResult property on the certification generation result.

### **Error: More than one possible pks12 cert file found in directory**

Make sure your certificate folder does not already contain a p12 certificate and the provided name is unique. Else leave on default naming.