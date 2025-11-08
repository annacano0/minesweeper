var validAge = false
/*Manejador del evento submit, que obtiene los valores de los campos y los pasa a toItemForStorage()*/
function manageFormSubmission() {
    let rows = document.getElementById("rows").value;
    let columns = document.getElementById("columns").value;
    let mines = document.getElementById("mines").value;
    toItemForStorage(rows, columns, mines);
}

/*transforma los datos del formulario en un item que sera pasado a la ventana principal,
ademas de ser guardado en la ventana del formulario, para acceder posteriormente con mayor facilidad*/
function toItemForStorage(rows, columns, mines) {
    let formData = {
        rows: rows,
        columns: columns,
        mines: mines
    };
    const formDataString = JSON.stringify(formData);
    console.log(formDataString);

    window.localStorage.setItem("user", formDataString);//se guarda tambien en esta ventana para poder accedes si se quieren modificar algunos datos
    window.opener.saveToLocalStorage("user", formDataString);//se envia el conjuto de datos a la ventana inicial
    window.close()//se cierra la ventana actual
}

/*añade eventos al formulario*/
function addEventListeners() {
    let button = document.getElementById("buttonSubmit");
    button.addEventListener("click", manageFormSubmission);
}

/* funcion que rellena los campos y bloquea  si ya hay datos*/

function init() {
    addEventListeners();// se añaden eventos 
}