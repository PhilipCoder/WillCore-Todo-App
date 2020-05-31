const path = require("path");

class pathHelper {
    constructor(rootDirectory){
        this.rootDirectory = rootDirectory;
    }
    get projectDir() {
        return path.normalize(`${this.rootDirectory}`);
    }

    getRelativePath(sourcePath, targetPath) {
        let fullTargetPath = path.join(this.projectDir, targetPath);
        let relativePath = path.relative(sourcePath, fullTargetPath);
        relativePath = relativePath.startsWith(".") ? relativePath : '.' + path.join("\\", relativePath);
        return relativePath;
    }

    getAbsolutePath(sourcePath, targetPath) {
        sourcePath = sourcePath.replace(/\//g, '\\');
        targetPath = targetPath.replace(/\//g, '\\');

        let fullTargetPath = path.join(this.projectDir, targetPath);
        return fullTargetPath;
    }

    getFilePath(assignablePath, filePath) {
        let directory = this.getAbsolutePath(this.projectDir, assignablePath);
        filePath = filePath.replace(/\//g, '\\');
        let finalFilePath = path.join(directory, filePath);
        finalFilePath = path.normalize(finalFilePath);
        if (!finalFilePath.toLowerCase().startsWith(directory.toLowerCase())) return false;
        return finalFilePath;
    }
};

module.exports = pathHelper;