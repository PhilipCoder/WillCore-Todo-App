const configModel = require("./models/config.js");
const fs = require("fs");
const path = require("path");
const spawn = require("child_process").spawn;
const process = require("process");
const pem = require("pem");

/**
 * Utility to create and use self-certificates.
 * 
 * Author: Philip Schoeman
 * @param {import('./models/config.js')} config 
 */

async function autoSelfSign(config) {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    validateConfig(config);
    let certFileStats = await checkCertFiles(config);
    let pkcs12GenerationResult = await generatePKCS12(certFileStats, config);
    let certStatsPKCS12 = await checkCertFiles(config);
    let x509Values = await generateCert(certFileStats, certStatsPKCS12);
    saveX509Values(certFileStats, x509Values);
    let certInstallationResult = await installCertificate(config, certFileStats, certStatsPKCS12);
    await cleanup(config, pkcs12GenerationResult, certInstallationResult);
    return { ...x509Values, pkcs12GenerationResult, certInstallationResult };
}

//If any errors were encountered during the generation or installation process, delete the certificate files.
async function cleanup(config, pkcs12GenerationResult, certInstallationResult) {
    if (!pkcs12GenerationResult.hasError && !certInstallationResult.hasError) return;
    let certFileStats = await checkCertFiles(config);
    if (certFileStats.cert.fileExists) fs.unlinkSync(certFileStats.cert.filePath);
    if (certFileStats.key.fileExists) fs.unlinkSync(certFileStats.key.filePath);
    if (certFileStats.pkcs12.fileExists) fs.unlinkSync(certFileStats.pkcs12.filePath);
    if (certFileStats.chained.fileExists) fs.unlinkSync(certFileStats.chained.filePath);
    if (certFileStats.intermediate.fileExists) fs.unlinkSync(certFileStats.intermediate.filePath);
}

//Installs the certificate into the windows Trusted Root Store.
function installCertificate(config, certFileStats, certStatsPKCS12) {
    return new Promise((resolve, reject) => {
        if (!config.installCertWindows || certFileStats.pkcs12.fileExists) {
            resolve([]);
        }
        else {
            let prc = spawn("CERTUTIL", ['-f', '-p', `changeit`, "-importpfx", certStatsPKCS12.pkcs12.filePath]);
            let hasErrors = true;
            let certutilOutput = [];
            prc.stdout.setEncoding('utf8');

            prc.stdout.on('data', function (data) {
                if (data.indexOf("success") > -1) {
                    hasErrors = false;
                }
                certutilOutput.push(data);
            });

            prc.on('close', function (code) {
                if (hasErrors) {
                    certutilOutput.hasError = true;
                    resolve(certutilOutput);
                } else {
                    resolve(certutilOutput);
                }
            });
        }
    });
}

//Saves the generated x.509 values 
function saveX509Values(certFileStats, x509Values) {
    if (certFileStats.pkcs12.fileExists) return;
    fs.writeFileSync(certFileStats.cert.filePath, x509Values.cert);
    fs.writeFileSync(certFileStats.key.filePath, x509Values.key);
    fs.writeFileSync(certFileStats.chained.filePath, x509Values.chained);
    fs.writeFileSync(certFileStats.intermediate.filePath, x509Values.intermediate);

}

//Generate x.509 values from the PKCS12 certificate using OpenSSL.
function generateCert(certFileStats, certStatsPKCS12) {
    return new Promise((resolve, reject) => {
        if (
            certFileStats.pkcs12.fileExists && 
            certFileStats.cert.fileExists && 
            certFileStats.key.fileExists &&
            certFileStats.chained.fileExists &&
            certFileStats.intermediate.fileExists
            ) {
            resolve({
                key: fs.readFileSync(certFileStats.key.filePath, 'utf8'),
                cert: fs.readFileSync(certFileStats.cert.filePath, 'utf8'),
                chained: fs.readFileSync(certFileStats.cert.filePath, 'utf8'),
                intermediate: fs.readFileSync(certFileStats.cert.filePath, 'utf8')
            });
        } else {
            process.env.OPENSSL_BIN = path.join(__dirname, "bin", "openssl", "openssl.exe");
            pem.readPkcs12(certStatsPKCS12.pkcs12.filePath, { p12Password: "changeit" }, (err, cert) => {
                resolve({
                    key: cert.key,
                    cert: cert.cert,
                    intermediate: cert.ca[0],
                    chained: [cert.cert,...cert.ca].join("\n")
                });
            });
        }
    });
}

//Generate the PKCS12 certificate using makecert.
function generatePKCS12(certFileStats, config) {
    return new Promise((resolve, reject) => {
        if (certFileStats.pkcs12.fileExists) {
            resolve([]);
        }
        else {
            let makeCertExe = path.join(__dirname, "bin", "mkcert", "mkcert.exe");
            let currentDir = process.cwd();
            process.chdir(config.certificateFolder);
            let prc = spawn(makeCertExe, ['-pkcs12', config.pkcs12CertFileName, `localhost`, `*.localhost`]);
            let hasErrors = true;
            let certutilOutput = [];
            prc.stdout.setEncoding('utf8');

            prc.stdout.on('data', function (data) {
                if (data.indexOf("Created a new certificate") > -1) {
                    hasErrors = false;
                }
                certutilOutput.push(data);
            });

            prc.on('close', function (code) {
                process.chdir(currentDir);
                if (hasErrors && certutilOutput.length > 0) {
                    certutilOutput.hasError = true;
                    resolve(certutilOutput);
                } else {
                    resolve(certutilOutput);
                }
            });
        }
    });
}

//Validates the configuration file.
/** @param {import('./models/config.js')} config */
function validateConfig(config) {
    if (!(config)) throw "Config is not a config model.";
    let esd = fs.existsSync(config.certificateFolder);
    if (!esd) throw `Cert directory "${config.certificateFolder}" does not exist.`;
}

//Checks if the cert files exists and returns the paths to the files.
/** @param {import('./models/config.js')} config  */
async function checkCertFiles(config) {
    return {
        pkcs12: await pkcs12Exists(config),
        cert: {
            fileExists: fs.existsSync(path.join(config.certificateFolder, `${config.certFileName}.cert`)),
            filePath: path.join(config.certificateFolder, `${config.certFileName}.cert`)
        },
        key: {
            fileExists: fs.existsSync(path.join(config.certificateFolder, `${config.keyFileName}.key`)),
            filePath: path.join(config.certificateFolder, `${config.keyFileName}.key`)
        },
        chained: {
            fileExists: fs.existsSync(path.join(config.certificateFolder, `${config.chainedCertFileName}.cert`)),
            filePath: path.join(config.certificateFolder, `${config.chainedCertFileName}.cert`)
        },
        intermediate: {
            fileExists: fs.existsSync(path.join(config.certificateFolder, `${config.intermediateFileName}.cert`)),
            filePath: path.join(config.certificateFolder, `${config.intermediateFileName}.cert`)
        }
    };
}

//Checks if the PKCS12 certificate file exists.
/** @param {import('./models/config.js')} config  */
function pkcs12Exists(config) {
    return new Promise((resolve, reject) => {
        fs.readdir(config.certificateFolder, (err, files) => {
            let filesFound = files.filter(file => file.startsWith(config.pkcs12CertFileName));
            if (filesFound.length > 1) throw `More than one possible pks12 cert file found in directory "${config.certificateFolder}."`;
            resolve({
                fileExists: filesFound.length > 0,
                filePath: filesFound.length > 0 ? path.join(config.certificateFolder, filesFound[0]) : null
            });
        });
    });
}

module.exports = { autoSelfSign, config: configModel, internal: { pkcs12Exists, checkCertFiles, validateConfig, generatePKCS12, generateCert, saveX509Values, installCertificate } };