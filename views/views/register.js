const view = (model, ui, requests) => {
    //Value bindings
    model.userDetails = {
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: ""
    };

    //State bindings
    model.formState = {
        validated: false,
    };


    model.formStateValidations = {
        firstName: () => model.userDetails.firstName.length > 1,
        lastName: () => model.userDetails.lastName.length > 1,
        email: () => model.userDetails.email.length > 4 && model.userDetails.email.indexOf("@") > 1 && model.userDetails.email.lastIndexOf(".") > model.userDetails.email.indexOf("@"),
        password: () => model.userDetails.password.length > 5,
        confirmPassword: () => model.userDetails.confirmPassword === model.userDetails.password,
        isFormValid: () => model.formStateValidations.firstName() && model.formStateValidations.lastName() && model.formStateValidations.email() && model.formStateValidations.password() && model.formStateValidations.confirmPassword()
    };

    model.$nameInput.model = () => model.userDetails.firstName;
    model.$surnameInput.model = () => model.userDetails.lastName;
    model.$emailInput.model = () => model.userDetails.email;
    model.$passwordInput.model = () => model.userDetails.password;
    model.$confirmPasswordInput.model = () => model.userDetails.confirmPassword;
    model.$nameInput["is-invalid"].class = () => !model.formStateValidations.firstName() && model.formState.validated;
    model.$surnameInput["is-invalid"].class = () => !model.formStateValidations.lastName() && model.formState.validated;
    model.$emailInput["is-invalid"].class = () => !model.formStateValidations.email() && model.formState.validated;
    model.$passwordInput["is-invalid"].class = () => !model.formStateValidations.password() && model.formState.validated;
    model.$confirmPasswordInput["is-invalid"].class = () => !model.formStateValidations.confirmPassword() && model.formState.validated;

    //Events
    model.$registerButton.onclick.event = async () => {
        model.formState.validated = true;
        if (model.formStateValidations.isFormValid()) {
            let registrationResult = await requests.accounts.register.post(model.userDetails);
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