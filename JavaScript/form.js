var validAge=false
/*Manejador del evento submit, que obtiene los valores de los campos y los pasa a toItemForStorage()*/
function manageFormSubmission(){
    let birthday = document.getElementById("birthday").value;
    let name = document.getElementById("name").value;
    let surname = document.getElementById("surname").value;
    let nick = document.getElementById("nick").value;
    let mail = document.getElementById("mail").value;
    let rows = document.getElementById("rows").value;
    let columns = document.getElementById("columns").value;
    let mines=document.getElementById("mines").value;
    let password=document.getElementById("password").value;
    console.log("Se intenta guardar info")
    toItemForStorage(name, surname, birthday, nick, mail, rows, columns, mines, password);

}
/* funcion que comprueba que el usuario sea mayor de edad*/
function checkAge(){
    let birthdayField = document.getElementById("birthday");
    let today = new Date();
    let birthDate = new Date(birthdayField.value);
    let age = today.getFullYear() - birthDate.getFullYear();
    let month = today.getMonth() - birthDate.getMonth();
     
    // Comprobar si la persona es mayor de edad
    if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    if (age < 18) {
        birthdayField.setCustomValidity("You have to be over 18 :(");
        birthdayField.reportValidity();
    } else {
        birthdayField.setCustomValidity(""); // Restablecer el mensaje de error
    }
}

/*transforma los datos del formulario en un item que sera pasado a la ventana principal,
ademas de ser guardado en la ventana del formulario, para acceder posteriormente con mayor facilidad*/
function toItemForStorage(name, surname, birthday, nick, mail, rows, columns, mines, password){
    let formData = {
        name: name,
        surname: surname,
        birthday: birthday,
        nick: nick,
        mail: mail,
        rows: rows,
        columns: columns,
        mines: mines,
        password: password
    };
    window.localStorage.setItem("user", JSON.stringify(formData));//se guarda tambien en esta ventana para poder accedes si se quieren modificar algunos datos
    window.opener.saveToLocalStorage("user", JSON.stringify(formData));//se envia el conjuto de datos a la ventana inicial
    window.close()//se cierra la ventana actual
}

 /*añade eventos al formulario*/
function addEventListeners() {
    let birthdayField = document.getElementById("birthday");
    let button = document.getElementById("buttonSubmit");

    birthdayField.addEventListener("blur", checkAge);

    button.addEventListener("click", checkAge);
}

 /* funcion que rellena los campos y bloquea  si ya hay datos*/
function fillAndLockFields() {
    let nameField = document.getElementById("name");
    let surnameField = document.getElementById("surname");
    let birthdayField = document.getElementById("birthday");
    let nickField = document.getElementById("nick");
    let mailField = document.getElementById("mail");
    let passwordField = document.getElementById("password");

    if (window.localStorage.getItem("user") !== null) {
        let formData = JSON.parse(window.localStorage.getItem("user"));
        nameField.value = formData.name;
        surnameField.value = formData.surname;
        birthdayField.value = formData.birthday;
        nickField.value = formData.nick;
        mailField.value = formData.mail;
        passwordField.value = formData.password;

        // Bloquear los campos
        nameField.disabled = true;
        surnameField.disabled = true;
        birthdayField.disabled = true;
        nickField.disabled = true;
        mailField.disabled = true;
        passwordField.disabled = true;
    }
}

function init(){
    fillAndLockFields();//se rellenan y bloquean los campos si ya hay informacion
    addEventListeners();// se añaden eventos 
}