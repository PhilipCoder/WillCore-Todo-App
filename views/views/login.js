//Login view function
const view = (model, ui, requests) => {
    //User data
    model.userDetails = {
        email: "",
        password: ""
    };

    //State data
    model.formState = {
        validated: false,
    };

    //Validations
    model.formStateValidations = {
        email: () => model.userDetails.email.length > 4 && model.userDetails.email.indexOf("@") > 1 && model.userDetails.email.lastIndexOf(".") > model.userDetails.email.indexOf("@"),
        password: () => model.userDetails.password.length > 5,
        isFormValid: () => model.formStateValidations.email() && model.formStateValidations.password()
    };

    //Bindings
    model.$emailInput.model = () => model.userDetails.email;
    model.$passwordInput.model = () => model.userDetails.password;
    model.$emailInput["is-invalid"].class = () => !model.formStateValidations.email() && model.formState.validated;
    model.$passwordInput["is-invalid"].class = () => !model.formStateValidations.password() && model.formState.validated;

    //Events
    model.$loginButton.onclick.event = async () => {
        model.formState.validated = true;
        if (model.formStateValidations.isFormValid()) {
            let registrationResult = await requests.accounts.login.post(model.userDetails);
            model.$messageAlert.bind = () => registrationResult.message;
            model.$messageAlert.show = () => true;
            model.$messageAlert["alert-danger"].class = () => !registrationResult.success;
            model.$messageAlert["alert-success"].class = () => registrationResult.success;
            if (registrationResult.success) {
                window.setTimeout(() => { window.location = "#/"; }, 700);
            }
        }
    };

};

const layout = "/views/layouts/accountLayout";

export { view, layout };