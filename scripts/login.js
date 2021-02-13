// jshint esversion:6
const form = document.getElementById("form");
const email = document.getElementById("inputEmail");
const passwd = document.getElementById("inputPasswd");

document.addEventListener("DOMContentLoaded", console.log(cargarUsuarios()));

form.addEventListener('submit', (e) => {
    //Evitamos el envio de forms vacios
    e.preventDefault();

    if (verificaCampos()) {
        inicioSesion();
    }
});

function inicioSesion() {
    /*En este punto de la ejecución los datos ya han sido validados 
    por lo tanto solo los guardaremos y crearemos una sesión.*/
    
    let usrEmail = email.value;
    let usrActuales = cargarUsuarios();
    //Obtenemos solo el usuario que esta iniciando sesión
    const usrSesion = usrActuales.find(usuario => usuario.email === usrEmail);
    //Creamos la sesión
    sessionStorage.setItem('Sesion', JSON.stringify(usrSesion));
    // Ahora nos dirijimos al menú de la app
    window.location.replace("menu.html");
}

function cargarUsuarios() {
    //Verifica que existan usuarios en el localStorage
    //Si esta vacio inicializa el arreglo
    let usrActuales;
    if (localStorage.getItem("Usuarios") === null) {
        usrActuales = [];
        console.log("No hay usuarios registrados aun");
    }
    else {
        //Los obtenemos y alimentamos el array usrActuales
        usrActuales = JSON.parse(localStorage.getItem("Usuarios"));
    }
    return usrActuales;
}

function verificaCampos() {
    const valorEmail = email.value.trim();
    const valorPasswd = passwd.value.trim();

    var lleno = true;

    if (valorEmail === '') {
        errorPara(email, "El email no puede estar vacio.");
        lleno = false;

    } else if (!verificaEmail(valorEmail)) {
        errorPara(email, "No es una dirección de email válida.");
        lleno = false;

    } else if (!emailExiste(valorEmail)) {
        errorPara(email, "No existe una cuenta asociada a este email.");
        lleno = false;

    } else {
        correctoPara(email);
    }

    if (valorPasswd === '') {
        errorPara(passwd, "Tu contraseña no puede estar vacia.");
        lleno = false;

    } else if (!matchPasswd(valorEmail, valorPasswd)) {
        errorPara(passwd, "Tu contraseña y tu email no coinciden.");
        lleno = false;

    } else {
        correctoPara(passwd);
    }
    return lleno;
}

function errorPara(valor, mensaje) {
    const formControl = valor.parentElement;
    const small = formControl.querySelector("small");

    small.innerText = mensaje;
    formControl.classList.add("error");
}

function correctoPara(valor) {
    const formControl = valor.parentElement;

    if (formControl.classList.contains("error")) {
        formControl.classList.remove("error");
    }
    formControl.classList.add("exito");
}

function verificaEmail(email) {
    //Cadena Regex para email
    return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);
}

function emailExiste(valorEmail) {
    let usrActuales = cargarUsuarios();
    if (usrActuales.length > 0) {
        //Buscamos en el array usrActuales si existe el email
        var emailUsr = usrActuales.find(usuario => usuario.email === valorEmail);

        //Si esta indefinido significa que es una cuenta no registrada
        if (typeof emailUsr !== "undefined") {
            return true;
        }
    }
    return false;
}

function matchPasswd(valorEmail, valorPasswd) {
    let usrActuales = cargarUsuarios();
    if (usrActuales.length > 0) {
        //Buscamos el objeto que coincida con el email y la contraseña ingresada
        var usr = usrActuales.find(usuario => usuario.email === valorEmail && usuario.passwd === valorPasswd);

        //Si esta indefinido no existe tal objeto, por lo tanto el email y contraseña no coinciden
        if (typeof usr === "undefined") {
            return false;
        }
    }
    return true;
}