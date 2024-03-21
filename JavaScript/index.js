/***** GLOBALES *****/
let banderasColocadas = 0
let casillasPorRevelar = 0


/***************     FUNCIONES     *******************/
//TODO: hacer que casilla tenga el ATR de posicion y mina(? y que no se le tenga que pasar tablero.
//TODO:haecr popup
//TODO: hacer que el juego acabe (WIN and LOSE)
//añadir opcion de modificar los datos
//hacer que no se puedan añadir banderas a casillas reveladas

function pintaTablero(tablero) {
  //TODO:crear tablero si no existe o recuperar elemento tablero 
  let tableroDOM =getOrCreateElement("tablero");
    let contenedor = document.getElementById("contenedorJuego");
    contenedor.appendChild(tableroDOM);
    tableroDOM.classList.add("center");
 
  //recorrer tablero
  for (let fila of tablero.matrizCasillas) {
    //se crea fila
    let filaFisica = document.createElement('div')
    filaFisica.classList.add("fila")
    //se crean casillas
    for (let elemento of fila) {
      let casilla = configurarCasilla(elemento, tableroDOM, tablero)//se configura el texto, si tiene bamdera, el css,...
      filaFisica.appendChild(casilla);
    }
    tableroDOM.appendChild(filaFisica);
  }
  addContador(tablero)
}

function getOrCreateElement(id){
  let elemento = document.getElementById(id);
  if (!elemento) {
    elemento = document.createElement('div');
    elemento.id = 'tablero';
  } else {
    elemento.innerHTML = ''; 
  }
  return elemento
}

function configurarCasilla(elemento, contenedor, tablero) {
  let casilla = document.createElement("div")
  if (elemento.adyacentes != 0 && elemento.revelada == true && elemento.mina != 1) casilla.textContent = elemento.adyacentes
  casilla.classList.add("casilla", "corners")
  if (elemento.revelada == true) {
    casilla.classList.add("revelada");
    //si se revela una casilla en dom y es una mina, se pinta y añade emoji de mina
    if (elemento.mina == 1) addEmojiBomba(casilla)
  }
  if (elemento.bandera == true) addEmojiBandera(casilla);
  //se añaden eventos
  if (!tablero.isGameOver) {
    casilla.addEventListener("contextmenu", (ev) => eventoClickBandera(ev, contenedor, tablero, elemento.posicionX, elemento.posicionY))
    casilla.addEventListener("click", () => eventoClickRevelar(contenedor, tablero, elemento.posicionX, elemento.posicionY))
  } else gameOverDOM()
  return casilla
}

function addEmojiBomba(casilla) {
  casilla.classList.add("mina");
  let minaEmoji = document.createElement("span");
  minaEmoji.textContent = "💥";
  casilla.appendChild(minaEmoji);
}

function addEmojiBandera(casilla) {
  casilla.classList.add("bandera");
  let banderaEmoji = document.createElement("span");
  banderaEmoji.textContent = "🚩";
  casilla.appendChild(banderaEmoji);
  casilla.classList.add("bandera");
}

function eventoClickBandera(ev, contenedor, tablero, x, y) {
  try {
    ev.preventDefault();
    tablero.toggleFlag(y, x)
    console.log("click bandera")
    contenedor.innerHTML = ""
    pintaTablero(tablero)
  } catch (error) {
    console.log("Error: ", error.message)
    addErrorMessage("No flags left 😔")
  }

}

function eventoClickRevelar(contenedor, tablero, x, y) {
  try {
    tablero.revelarCasilla(y, x)
    console.log("click revelar")
    if (banderasColocadas == casillasPorRevelar) gameOverDOM()
    contenedor.innerHTML = ""
    pintaTablero(tablero)
  } catch (error) {
    console.log("Error: ", error.message);
    gameOverDOM()
  }

}
function addContador(tablero) {
  let contenedor = document.getElementById("counter-container");
  contenedor.innerHTML = ""
  let banderas = document.createElement('p');
  banderas.setAttribute("id", "counter");
  banderas.classList.add("center")
  banderas.textContent = banderasColocadas + "🚩/" + tablero.numMinas + "🚩";
  contenedor.appendChild(banderas)
}
function addErrorMessage(message) {
  let container = document.getElementById("errorContainer");
  let messageDiv = document.createElement('p');
  messageDiv.classList.add("errorMessage")
  messageDiv.innerHTML = message;
  container.appendChild(messageDiv);
}

function removeErrorMessage() {
  let container = document.getElementById("errorContainer");
  container.innerHTML = "";
}

function gameOverDOM() {
  let i = 10;
  const idInterval = setInterval(() => {
    removeErrorMessage();
    let message = `¡BOOM! <br> Game will restart in ${i--} seconds`
    if (banderasColocadas == casillasPorRevelar) message = `YOU WON! <br> Game will restart in ${i--} seconds`
    addErrorMessage(message);
    if (i === 0) {
      clearInterval(idInterval);
      location.reload();
    }
  }, 1000);
  removeErrorMessage()
}

/* Funcion que es llamada desde form.js para añadir los datos al localStorage*/
function saveToLocalStorage(key, value) {
  window.localStorage.setItem(key, value);
}

/*Metodo que accede al local storage para recuperar la informacion del usuario, si no hay informacion, se abre el formulario*/
function getLocalStorage(modifyData) {
  if (!modifyData){
    addErrorMessage("You have to fill the form before playing 🤓 ")
    window.open("http://127.0.0.1:5500/html/form.html")

  } else{
     if (window.localStorage.getItem("user") == null) {
    window.open("http://127.0.0.1:5500/html/form.html")
  } else {
    removeErrorMessage()
  }
  return window.localStorage.getItem("user")
  }
 
}

function init() {
  removeErrorMessage()
  let info_usuario=" "
  if(window.localStorage.getItem("user")==null) info_usuario = getLocalStorage(false)  
  else info_usuario = window.localStorage.getItem("user")
  removeErrorMessage()
  if (info_usuario) {
    info_usuario = JSON.parse(info_usuario);
    let nuevoTablero = new Tablero(info_usuario.columns, info_usuario.rows, info_usuario.mines);
    casillasPorRevelar == nuevoTablero.filas * nuevoTablero.columnas
    pintaTablero(nuevoTablero);
  }


}


