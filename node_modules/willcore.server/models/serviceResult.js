class serviceResult {
    /**
     * 
     * @param {number} status Indicates the response status code, example 200 
     * @param {string} mime Indicates the response type, example application/json
     * @param {string} data The data that should be written into the response
     */
    constructor(status, mime, data) {
        this.status = status;
        this.mime = mime;
        this.data = data;
    }
}

module.exports = serviceResult;