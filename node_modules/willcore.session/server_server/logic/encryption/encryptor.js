var aesjs = require('./aes.js');

class Encryptor {
    encryptObject(value, config) {
        var json = JSON.stringify(value);
        var textBytes = aesjs.utils.utf8.toBytes(json);
        var key = aesjs.utils.utf8.toBytes(config.encryptionKey);
        var aesCtr = new aesjs.ModeOfOperation.ctr(key);
        var encryptedBytes = aesCtr.encrypt(textBytes);
        return aesjs.utils.hex.fromBytes(encryptedBytes);
    }

    decryptObject(stringValue, config) {
        var key = aesjs.utils.utf8.toBytes(config.encryptionKey);
        var encryptedBytes = aesjs.utils.hex.toBytes(stringValue);
        var aesCtr = new aesjs.ModeOfOperation.ctr(key);
        var decryptedBytes = aesCtr.decrypt(encryptedBytes);
        var decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes);
        return JSON.parse(decryptedText);
    }
}

module.exports = Encryptor;