class Casilla {
    mina;
    bandera;
    revelada;
    adyacentes;
    posicionX;
    posicionY;

    constructor(mina, adyacentes, posicionX, posicionY) {
        this.mina = mina;
        this.bandera = false;
        this.revelada = false;
        this.adyacentes = adyacentes;
        this.posicionX = posicionX;
        this.posicionY = posicionY;
    }

}