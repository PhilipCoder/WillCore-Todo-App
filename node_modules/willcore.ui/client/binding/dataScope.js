class _dataScope {
    constructor() {
        this.bindable = null;
    }
    hasBindable(){
        return !!this.bindable;
    }
    setBindable(bindable) {
        this.bindable = bindable;
    }
    removeBindable(){
        this.bindable = null;
    }
}

const dataScope = new _dataScope();

export { dataScope };