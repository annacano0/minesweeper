/***** CONSTANTES *****/
let banderasColocadas = 0



/***************     FUNCIONES     *******************/
//TODO: crear excepciones de game over, you won, no flags. HAy que lanzarlas en las clases, y que llamen a las funciones respectivas
//TODO: hacer que casilla tenga el tar de posicion y mina(? y que no se le tenga que pasar tablero.

function pintaTablero(tablero) {
  let contenedor = document.getElementById("tablero")
  contenedor.classList.add("center", "corners");
  //recorrer tablero
  for (let fila of tablero.matrizCasillas) {
    //se crea fila
    let filaFisica = document.createElement('div')
    filaFisica.classList.add("fila")
    //se crean casillas
    for (let elemento of fila) {
      let casilla = configurarCasilla(elemento, contenedor, tablero)//se configura el texto, si tiene bamdera, el css,...
      filaFisica.appendChild(casilla);
    }
    contenedor.appendChild(filaFisica);
  }
  addContador(tablero)

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
  try{
    ev.preventDefault();
  tablero.toggleFlag(y, x)
  console.log("click bandera")
  contenedor.innerHTML = ""
  pintaTablero(tablero)
  }catch (error){
    console.log("Error: ", error.message)
    addErrorMessage("No flags left 😔")
  }
  
}

function eventoClickRevelar(contenedor, tablero, x, y) {
  try {
    tablero.revelarCasilla(y, x)
    console.log("click revelar")
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
    let message=`¡BOOM! <br> Game will restart in ${i--} seconds`
   addErrorMessage(message);
    if (i === 0) {
      clearInterval(idInterval);
      location.reload();
    }
  }, 1000);
  removeErrorMessage()
}

function init() {
  let nuevoTablero = new Tablero(13, 13, 13);
  pintaTablero(nuevoTablero);
}


