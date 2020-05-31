function getURLParameters(objectToAssignTo) {
    let url = window.location.hash.slice(1) || "/";
    if (url.indexOf("?") > -1) {
        url = url.substring(url.indexOf("?") + 1);
    } else {
        return;
    }
    let urlParameters = url.split("&");
    urlParameters.forEach(parameter => {
        let segments = parameter.split("=");
        if (segments.length !== 2) {
            willCoreModules.execptionHander.handleExeception("Invalid URL parameters", `Unable to parse the current URL to any meaningful values.`);
        }
        objectToAssignTo[segments[0]] = decodeURIComponent(segments[1]);
    });
}

const getHashValues = () => {
    let hash = window.location.hash;
    let parameterIndex = hash.indexOf("?");
    let viewURL = parameterIndex > -1 ? hash.substring(1, parameterIndex) : hash.substring(1);
    let parameterObj = {};
    getURLParameters(parameterObj);
    let viewName = viewURL === "/" ? "index" : viewURL.substring(viewURL.lastIndexOf("/") + 1);
    const urlObject = {
        url: viewURL,
        name: viewName,
        parameters: parameterObj
    };
    return urlObject;
};

export { getHashValues };