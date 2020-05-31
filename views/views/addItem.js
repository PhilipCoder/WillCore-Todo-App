const view = (model, ui, server) => {
    //Data Collection
    model.itemDetails = model.mode.isEdit ? model.itemDetails : {
        title: "",
        description: "",
        id: null
    };

    //State bindings
    model.formState = {
        validated: false,
    };

    //Validations
    model.formStateValidations = {
        title: () => model.itemDetails.title.length > 1,
        description: () => model.itemDetails.description.length > 1,
        isFormValid: () => model.formStateValidations.description() && model.formStateValidations.title()
    };

    //Bindings
    model.$modalTitle.bind = () => model.itemDetails.id ? "Edit Todo Item" : "Add Todo Item";
    model.$addItemButton.bind = () => model.itemDetails.id ? "Save Changes" : "Add Item";
    model.$noteTitle.model = () => model.itemDetails.title;
    model.$noteDescription.model = () => model.itemDetails.description;
    model.$noteTitle["is-invalid"].class = () => !model.formStateValidations.title() && model.formState.validated;
    model.$noteDescription["is-invalid"].class = () => !model.formStateValidations.description() && model.formState.validated;

    //Events 
    model.$closeModal.onclick.event = () => {
        model.close({});
    }

    model.$addItemButton.onclick.event = async () => {
        model.formState.validated = true;
        if (model.itemDetails.id) {
            let addNoteResult = await server.todoItems.updateItem.post(model.itemDetails);
            ui.bootstrapToast = ["Success", "Todo item is updated!", { style: "success" }];
        } else {
            let addNoteResult = await server.todoItems.addItem.post(model.itemDetails);
            ui.bootstrapToast = ["Success", "Todo item is created!", { style: "success" }];
        }
        model.close({ created: true });
    };

};

export { view };