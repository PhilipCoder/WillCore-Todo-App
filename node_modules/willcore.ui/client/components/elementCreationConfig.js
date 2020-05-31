class elementCreationConfig {
    constructor() {
        this.html = null;
        this.htmlTemplateURL = null;
    }
    validate(){
        if (!this.html && !this.htmlTemplateURL) throw `Invalid custom element configuration. Please set the HTML or HTMLTemplateURL properties.`;
    }
}

export { elementCreationConfig };