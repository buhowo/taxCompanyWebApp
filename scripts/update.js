// jshint esversion:6
const form = document.getElementById("form");
const nombre = document.getElementById("nombre");
const rfc = document.getElementById("rfc");
const direccion = document.getElementById("direccion");
const telefono = document.getElementById("telefono");
const website = document.getElementById("webUrl");
const passwd = document.getElementById("passwd");
const passwd2 = document.getElementById("passwd2");

document.addEventListener("DOMContentLoaded", console.log(cargarUsuarios()));

form.addEventListener('submit', (e) => {
    //Evitamos el envio de forms vacios
    e.preventDefault();

    //Si todos los campos introducidos son correctos, procede agregando el usuario al almacenamiento
    if (verificaCampos()) {
        actualizarUsuario();
        //Redireccionamiento a la pantalla de menu
        window.location.replace("menu.html");
    }
});

function getUserInfo() {
    return JSON.parse(sessionStorage.getItem("Sesion"));
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
    //Validacion de campos de acuerdo a la especificación de requisitos
    const valorNombre = nombre.value.trim();
    const valorRFC = rfc.value.trim();
    const valorDireccion = direccion.value.trim();
    const valorTelefono = telefono.value.trim();
    const valorWebsite = website.value.trim();
    const valorPasswd = passwd.value.trim();
    const valorPasswd2 = passwd2.value.trim();

    var lleno = true;

    if (valorNombre === '') {
        errorPara(nombre, "El nombre de usuario no puede estar vacio.");
        lleno = false;

    } else {
        correctoPara(nombre);
    }

    if (valorRFC === '') {
        errorPara(rfc, "El RFC no puede estar vacio.");
        lleno = false;

    } else if (!verificaRFC(valorRFC)) {
        errorPara(rfc, "No es un RFC válido.");
        lleno = false;

    } else if (rfcDuplicado(valorRFC)) {
        errorPara(rfc, "Este RFC ya está registrado.");
        lleno = false;

    } else {
        correctoPara(rfc);
    }

    if (valorDireccion === '') {
        errorPara(direccion, "La dirección no puede estar vacia");
        lleno = false;

    } else {
        correctoPara(direccion);
    }

    if (valorTelefono === '') {
        errorPara(telefono, "El teléfono no puede estar vacio");
        lleno = false;

    } else {
        correctoPara(telefono);
    }

    if (valorWebsite === '') {
        errorPara(website, "La URL del sitio web no puede estar vacia incluye https:");
        lleno = false;

    } else {
        correctoPara(website);
    }

    if (valorPasswd === '') {
        errorPara(passwd, "Tu contraseña no puede estar vacia.");
        lleno = false;

    } else {
        correctoPara(passwd);
    }

    if (valorPasswd2 === '') {
        errorPara(passwd2, "Este campo no puede estar vacio.");
        lleno = false;

    } else if (valorPasswd !== valorPasswd2) {
        errorPara(passwd2, "Las contraseñas no coinciden");
        lleno = false;

    } else {
        correctoPara(passwd2);
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

function verificaRFC(rfc) {
    //Cadena Regex para rfc
    return /^([A-ZÑ&]{3,4}) ?(?:- ?)?(\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])) ?(?:- ?)?([A-Z\d]{2})([A\d])$/.test(rfc);
}

function rfcDuplicado(valorRFC) {
    let usrActuales = cargarUsuarios();
    if (usrActuales.length > 0) {
        //Buscamos en el array usrActuales si existe el RFC que se esta intentando crear
        var rfcDuplicado = usrActuales.find(usuario => usuario.rfc === valorRFC.toString());

        //Si esta indefinido significa que es un registro nuevo
        if (typeof rfcDuplicado !== "undefined") {
            return true;
        }
    }
    return false;
}

function actualizarUsuario() {

    //Se actualiza todo menos el email, asi que lo obtenemos directo de la sesión actual
    let usrActual = getUserInfo();
    let usrActuales = cargarUsuarios();

    let usrIndex = usrActuales.findIndex(usr => usr.email === usrActual.email);

    usrActuales[usrIndex].nombre = nombre.value;
    usrActuales[usrIndex].rfc = rfc.value;
    usrActuales[usrIndex].direccion = direccion.value;
    usrActuales[usrIndex].telefono = telefono.value;
    usrActuales[usrIndex].website = website.value;
    usrActuales[usrIndex].passwd = passwd.value;

    localStorage.setItem("Usuarios", JSON.stringify(usrActuales));
    //Creamos la sesión
    sessionStorage.setItem('Sesion', JSON.stringify(usrActuales[usrIndex]));
    // Ahora nos dirijimos al menú de la app
    window.location.replace("menu.html");
    console.log(getUserInfo());
    console.log("Usuario actualizado!");
}