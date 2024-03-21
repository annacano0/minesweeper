function manageFormSubmission(){
    let name = document.getElementById("name").value;
    let surname = document.getElementById("surname").value;
    let birthday = document.getElementById("birthday").value;
    let nick = document.getElementById("nick").value;
    let rows = document.getElementById("rows").value;
    let columns = document.getElementById("columns").value;
    let mines=document.getElementById("mines").value;
    let password=document.getElementById("password").value;
    toItemForStorage(name, surname, birthday, nick, rows, columns, mines, password);

}

function toItemForStorage(name, surname, birthday, nick, rows, columns, mines, password){
    let formData = {
        name: name,
        surname: surname,
        birthday: birthday,
        nick: nick,
        rows: rows,
        columns: columns,
        mines: mines,
        password: password
    };
    window.localStorage.setItem("user", JSON.stringify(formData));//se guarda tambien en esta ventana para poder accedes si se quieren modificar algunos datos
    window.opener.saveToLocalStorage("user", JSON.stringify(formData));//se envia el conjuto de datos a la ventana inicial
    console.log("Se intenta cerrar la ventana")
    window.close()//se cierra la ventana actual
}

function init(){
    //rellenar y bloquear campos name, surname birthday nick y password si ya estan llenos
        let nameField = document.getElementById("name");
        let surnameField = document.getElementById("surname");
        let birthdayField = document.getElementById("birthday");
        let nickField = document.getElementById("nick");
        let passwordField = document.getElementById("password");
    
        if (window.localStorage.getItem("user") !== null) {
            let formData = JSON.parse(window.localStorage.getItem("user"));
            nameField.value = formData.name;
            surnameField.value = formData.surname;
            birthdayField.value = formData.birthday;
            nickField.value = formData.nick;
            passwordField.value = formData.password;
    
            nameField.disabled = true;
            surnameField.disabled = true;
            birthdayField.disabled = true;
            nickField.disabled = true;
            passwordField.disabled = true;
        }
    
    let button=document.getElementById("buttonSubmit")
    button.addEventListener("click", manageFormSubmission);

}