const view = async (model, ui, request) => {
     //Bindings
    model.todoItems = {
        items: []
    };

    model.todoItems.items = (await request.todoItems.getItems.get()).todoItems;

    model.$itemTable.show = () => model.todoItems.items.length > 0;
    model.$noItems.show = () => model.todoItems.items.length === 0;
    model.$addItemModalDiv.addItemModal.bootstrapModal = "/views/views/addItem";
    model.$itemRow.repeat = () => model.todoItems.items;
    
    //Initiate the repeat binding
    model.$itemRow.repeat = (elements, rowIndex) => {
        elements.$itemRowTitle.bind = () => model.todoItems.items[rowIndex].title;
        elements.$itemRowDescription.bind = () => model.todoItems.items[rowIndex].description;
        elements.$deleteBTN.onclick.event = async () => {
            ui.deletePrompt.bootstrapPrompt = ["Confirm", "Are you sure that you want to delete the todo item?", { yes: { label: "Yes", primary: true }, no: { label: "No", primary: false } }];
            let confirmResult = await ui.deletePrompt;
            if (confirmResult === "yes") {
                await request.todoItems.deleteItem.post({ id: model.todoItems.items[rowIndex].id });
                ui.bootstrapToast = ["Deleted", "Todo item is deleted!", { style: "success" }];
                model.todoItems.items = (await request.todoItems.getItems.get()).todoItems;
            }
        };
        elements.$editBTN.onclick.event = async () => {
            let result = await model.$addItemModalDiv.addItemModal.show({}, {
                mode: {
                    isEdit: true,
                },
                itemDetails: {
                    id: model.todoItems.items[rowIndex].id,
                    title: model.todoItems.items[rowIndex].title,
                    description: model.todoItems.items[rowIndex].description
                }
            });
            if (result.created) {
                model.todoItems.items = (await request.todoItems.getItems.get()).todoItems;
            }
        };
    };

     //Events 
    model.$addItemButton.onclick.event = async () => {
        let result = await model.$addItemModalDiv.addItemModal.show({},{ mode: {isEdit: false}});
        if (result.created) {
            model.todoItems.items = (await request.todoItems.getItems.get()).todoItems;
        }
    };
};

const layout = "/views/layouts/navLayout";

const access = async (willcore, server) => (await server.session.authenticated.get()).authenticated ? true : "views/views/login";

export { view, layout,access };