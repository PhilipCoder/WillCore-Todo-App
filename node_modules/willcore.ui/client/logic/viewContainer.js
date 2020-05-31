class _viewContainer {
    constructor() {
        this.views = {};
    }

    addView(view) {
        this.manageViews();
        this.views[view.viewId] = { view: view, previouslyLinked: view.viewIndicator.isConnected };
    }

    manageViews() {
        Object.keys(this.views).forEach(viewId => {
            let view = this.views[viewId];
            if (!view.previouslyLinked && view.view.viewIndicator.isConnected) {
                view.previouslyLinked = true;
            } else if (view.previouslyLinked && !view.view.viewIndicator.isConnected) {
                view.view.unload();
                delete this.views[viewId];
            }
        });
    }
}

const viewContainer = new _viewContainer();

export { viewContainer };