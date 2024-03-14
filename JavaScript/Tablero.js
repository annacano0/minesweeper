class Tablero {
  //atributos
  filas = 3;
  columnas = 3;
  numMinas = 1;
  matrizCasillas = [];
  isGameOver = false

  //constructor
  constructor(filas, columnas, numMinas) {
    if (filas > 3) this.filas = filas;
    if (columnas > 3) this.columnas = columnas;
    if (numMinas > 1) this.numMinas = numMinas;
    this.matrizCasillas = this.crearTablero();
    this.colocarMinas();
    this.addAdyacentes();
  }

  //metodos
  crearTablero() {
    let matriz = [];
    for (let i = 0; i <= this.filas - 1; i++) {
      let fila = [];
      for (let j = 0; j <= this.columnas - 1; j++) {
        let casilla = new Casilla(0, 0, j, i);
        fila.push(casilla);
      }
      matriz.push(fila);
    }
    console.log("Se ha creado el tablero");
    return matriz;
  }

  colocarMinas() {
    let contadorMinas = this.numMinas;
    while (contadorMinas > 0) {
      let x = Math.floor(Math.random() * this.filas);
      let y = Math.floor(Math.random() * this.columnas);
      if (this.matrizCasillas[x][y].mina == 0) {
        this.matrizCasillas[x][y].mina = 1;
        contadorMinas--;
      }
    }
    console.log("Minas colocadas")
  }


  addAdyacentes() {
    for (let i = 0; i < this.matrizCasillas.length; i++) {
      for (let j = 0; j < this.matrizCasillas[i].length; j++) {
        let contador = 0;

        contador += this.esMina(i - 1, j); // Arriba
        contador += this.esMina(i + 1, j); // Abajo
        contador += this.esMina(i, j - 1); // Izquierda
        contador += this.esMina(i, j + 1); // Derecha
        contador += this.esMina(i - 1, j - 1); // Esquina sup izq
        contador += this.esMina(i - 1, j + 1); // Esquina sup d
        contador += this.esMina(i + 1, j - 1); // Esquina inf izq
        contador += this.esMina(i + 1, j + 1); // Esquina inf d

        this.matrizCasillas[i][j].adyacentes = contador;
      }
    }
  }


  esMina(i, j) {
    if (i >= 0 && i < this.matrizCasillas.length && j >= 0 && j < this.matrizCasillas[i].length) {
      if (this.matrizCasillas[i][j].mina == 1) return 1
    }
    return 0;
  }

  revelarCasilla(i, j) {
    if (i >= 0 && i < this.matrizCasillas.length && j >= 0 && j < this.matrizCasillas[0].length && !this.matrizCasillas[i][j].revelada && !this.matrizCasillas[i][j].bandera) {
      const casilla = this.matrizCasillas[i][j];
      casilla.revelada = true;

      if (casilla.mina == 1) throw new Error ("Game Over")
      else if (this.matrizCasillas[i][j].adyacentes == 0) {
        this.revelarCasilla(i + 1, j)
        this.revelarCasilla(i - 1, j)
        this.revelarCasilla(i, j + 1)
        this.revelarCasilla(i, j - 1)

        //esquinas
        this.revelarCasilla(i-1, j-1)
        this.revelarCasilla(i-1, j+1)

        this.revelarCasilla(i+1, j-1)
        this.revelarCasilla(i+1, j+1)
        
      }
    }
  }


  toggleFlag(x, y) {
    const casilla = this.matrizCasillas[x][y];
    removeErrorMessage()
    if (casilla.bandera) {
      casilla.bandera = false;
      banderasColocadas--
    } else {

      if (banderasColocadas < this.numMinas) {
        casilla.bandera = true
        banderasColocadas++
      } else throw new Error ("No flags left")

    }

  }

  gameOver() {
    this.isGameOver = true;
    //se revelaran todas las casillas menos las que tienen bandera
    for (let fila of this.matrizCasillas) {
      for (let casilla of fila) {
        if (!casilla.bandera && casilla.mina == 1) casilla.revelada = true;
      }
    }
  }
}