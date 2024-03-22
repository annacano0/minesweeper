/***** GLOBALES *****/
let banderasColocadas = 0
let casillasPorRevelar = 0
let userLost = false

/***************     FUNCIONES  TABLERO  *******************/

/*funcion que crea o añade un elemento mediante el id que debe tener*/
function getOrCreateElement(id) {
  let elemento = document.getElementById(id);
  if (!elemento) {
    elemento = document.createElement('div');
    elemento.id = 'tablero';
  } else {
    elemento.innerHTML = '';
  }
  return elemento
}

/*funcion que toma de referencia el objeto tablero, clase Tablero y lo crea en el DOM*/
function pintaTablero(tablero) {
  let tableroDOM = getOrCreateElement("tablero");//se crea o se llama al elemento, dependiendo si existe o no
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
      let casilla = configurarCasilla(elemento, tablero)//se configura el texto, si tiene bamdera, clases css,...
      filaFisica.appendChild(casilla);
    }
    tableroDOM.appendChild(filaFisica);
  }
  addContador(tablero)
}

/* funcion que coge como refererencia una casilla (elemento) 
y segun sus propiedades crea una casilla en el DOM con esas caracteristicas*/
function configurarCasilla(elemento, tablero) {
  let casilla = document.createElement("div")

  //se añaden textos, emojis y clases
  if (elemento.adyacentes != 0 && elemento.revelada == true && elemento.mina != 1) casilla.textContent = elemento.adyacentes
  casilla.classList.add("casilla", "corners")
  if (elemento.revelada == true) {
    casilla.classList.add("revelada");
    if (elemento.mina == 1) addEmojiBomba(casilla)
  }
  if (elemento.bandera == true) addEmojiBandera(casilla);

  //se añaden eventos para click si el juego no ha acabado
  if (!tablero.isGameOver) {
    casilla.addEventListener("contextmenu", (ev) => eventoClickBandera(ev, tablero, elemento.posicionX, elemento.posicionY))
    casilla.addEventListener("click", () => eventoClickRevelar(tablero, elemento.posicionX, elemento.posicionY))
  } else gameOverDOM()
  return casilla
}


/*funcion que añade un emoji de bomba a una casilla del DOM*/
function addEmojiBomba(casilla) {
  casilla.classList.add("mina");
  let minaEmoji = document.createElement("span");
  minaEmoji.textContent = "💥";
  casilla.appendChild(minaEmoji);
}

/*funcion que añade un emoji de bandera a una casilla del DOM y le añade la clase bandera*/
function addEmojiBandera(casilla) {
  casilla.classList.add("bandera");
  let banderaEmoji = document.createElement("span");
  banderaEmoji.textContent = "🚩";
  casilla.appendChild(banderaEmoji);
  casilla.classList.add("bandera");
}

/***************     FUNCIONES  HANDLER  DE  EVENTOS *******************/

/* funcion que maneja el click derecho sobre una casilla, pasando el evento (para evitar que salte el context menu),
 el tablero, y la posicion de la casilla. Tambien vuelve a llamar a que se pinte el tablero y si no hay mas banderas disponibles 
 hace un catch de una excepcion de Tablero, y añade el mensaje de error al DOM*/
function eventoClickBandera(ev, tablero, x, y) {
  try {
    ev.preventDefault();
    if (tablero.matrizCasillas[y][x].revelada == false) tablero.toggleFlag(y, x)
    pintaTablero(tablero)
    if (tablero.numMinas == banderasColocadas) gameOverDOM()
  } catch (error) {
    console.log("Error: ", error.message)
    addErrorMessage("No flags left 😔")
  }

}

/* funcion que maneja el click izquierdo sobre una casilla, pasando el tablero, y la posicion de la casilla.
Tambien vuelve a llamar a que se pinte el tablero y si se revela una casilla con mina 
 hace un catch de una excepcion de Tablero, y añade el mensaje de error al DOM*/
function eventoClickRevelar(tablero, x, y) {
  try {
    tablero.revelarCasilla(y, x)
    if (tablero.numMinas == banderasColocadas) gameOverDOM()
    pintaTablero(tablero)
  } catch (error) {
    console.log("Error: ", error.message);
    userLost = true
    gameOverDOM()
    pintaTablero(tablero)
  }
}

/***************     FUNCIONES AÑADIR ELEMENTOS A DOM  *******************/

/*funcion que añade al DOM el contador de banderas colocadas*/
function addContador(tablero) {
  let contenedor = document.getElementById("counter-container");
  contenedor.innerHTML = ""
  let banderas = document.createElement('p');
  banderas.setAttribute("id", "counter");
  banderas.classList.add("center")
  banderas.textContent = banderasColocadas + "🚩/" + tablero.numMinas + "🚩";
  contenedor.appendChild(banderas)
}
/*funcion que añade al dom el boton para acceder a los ajustes*/
function addSettingsButton() {
  let contenedor = document.getElementById("settings-container");
  contenedor.innerHTML = ""
  let button = document.createElement('button');
  button.setAttribute("id", "settings");
  button.classList.add("center")
  button.textContent = "⚙️";
  button.addEventListener("click", () => { getLocalStorage() })
  contenedor.appendChild(button);
}

/* funcion que añade un mensaje pasado por parametro al dom, especificamente al contenedor de mensajes*/
function addErrorMessage(message) {
  let container = document.getElementById("errorContainer");
  let messageDiv = document.createElement('p');
  messageDiv.classList.add("errorMessage")
  messageDiv.innerHTML = message;
  container.appendChild(messageDiv);
}

/* funcion que limpia el dom de mesajes en el contenedor de mensajes*/
function removeErrorMessage() {
  let container = document.getElementById("errorContainer");
  container.innerHTML = "";
}

/***************     FUNCIONES DE PARTIDA  *******************/

/*funcion que recupera los datos del usuario, inicializa un tablero, y lo pinta*/
function startGame(infoString) {
  addSettingsButton()//añade el boton de ajustes
  removeErrorMessage()//se eliminan mensajes previos
  info_usuario = JSON.parse(infoString);
  let nuevoTablero = new Tablero(info_usuario.columns, info_usuario.rows, info_usuario.mines);
  casillasPorRevelar = nuevoTablero.filas * nuevoTablero.columnas
  pintaTablero(nuevoTablero);
}

/*funcion que se ejecuta al acabar el juego y añade en el dom un mensaje (de victoria o derrota) ademas de un temporizador 
que indica cuando se iniciara otra partida*/
function gameOverDOM() {
  let i = 10;
  const idInterval = setInterval(() => {
    removeErrorMessage();
    let message = `¡BOOM! <br> Game will restart in ${i--} seconds`
    if (banderasColocadas == casillasPorRevelar && !userLost) message = `YOU WON! <br> Game will restart in ${i--} seconds`
    addErrorMessage(message);
    if (i == 0) {
      clearInterval(idInterval);
      location.reload();
    }
  }, 1000);
  removeErrorMessage()
}

/***************     FUNCIONES  STORAGE  *******************/


/* Funcion que es llamada desde form.js para añadir los datos al localStorage*/
function saveToLocalStorage(key, value) {
  window.localStorage.setItem(key, value);
  window.location.reload();
}

/*Metodo que accede al local storage para recuperar la informacion del usuario, si no hay informacion, se abre el formulario*/
function getLocalStorage() {
  if (window.localStorage.getItem("user") == null) {
    window.open("http://127.0.0.1:5500/html/form.html")

  } else window.open("http://127.0.0.1:5500/html/form.html")
  return window.localStorage.getItem("user")
}

/***************     INIT    *******************/


function init() {
  let info_usuario = " "
  //recupera los datos guardados
  if (window.localStorage.getItem("user") == null) {
    addErrorMessage("You have to fill the form before playing 🤓 ")
    info_usuario = getLocalStorage()
  }
  else info_usuario = window.localStorage.getItem("user")

  if (info_usuario) startGame(info_usuario)//si hay informacion guardada se podra iniciar el juego, si no , no.

}


