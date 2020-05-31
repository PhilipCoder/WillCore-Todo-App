const fs = require("fs");
class fileHelper {
    static readFile(filePath) {
        return new Promise((resolve, reject) => {
            fs.readFile(filePath, 'utf8', (err, contents)=> {
                resolve(contents);
            });
        });
    }

    static read(filePath) {
        return new Promise((resolve, reject) => {
            fs.readFile(filePath,  (err, contents) => {
                resolve(contents);
            });
        });
    }

    static writeFile(filePath, content) {
        return new Promise((resolve, reject) => {
            fs.writeFile(filePath, content, 'utf8', (err)=> {
                if (err) {
                    resolve(false);
                } else {
                    resolve(true);
                }
            });
        });
    }

    static exists(filePath) {
        return new Promise((resolve, reject) => {
            fs.access(filePath, fs.F_OK, (err) => {
                if (err) {
                    resolve(false);
                }
                resolve(true);
            })
        });
    }
}

module.exports = fileHelper;