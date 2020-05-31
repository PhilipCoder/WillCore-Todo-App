module.exports = function (pathURL, service, server, willcore, pathHelper) {
    let relativePath = pathHelper.getRelativePath(__dirname, pathURL);
    require(relativePath)(service, server, willcore);
};