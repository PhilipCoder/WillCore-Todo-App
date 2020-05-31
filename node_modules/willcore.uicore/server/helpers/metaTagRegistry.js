class metaTagRegistry {
    constructor() {
        this.modules = [
            '<meta charset="utf-8">',
            '<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">'
        ];
        this.loaded = false;
    }

    registerTag(tag) {
        if (!this.loaded){
            this.loaded = true;
            this.modules = [];
        }
        this.modules.push(tag);
    }
}

module.exports = metaTagRegistry;