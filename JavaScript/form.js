function addFormValidation(){
    let inputs=document.getElementsByTagName('input');
    for(let input of inputs){
        input.addEventListener("onBlur", validateForm)
    }
}

function validateForm(event){
    console.log("se esta validando")
    setCustomValidity("Must be over 18")
}

function init(){
    addFormValidation()
    console.log("se ha cargado")
}