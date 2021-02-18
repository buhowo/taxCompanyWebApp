// jshint esversion:6
const form = document.getElementById("form");
const nombre = document.getElementById("nombre");
const email = document.getElementById("inputEmail");
const rfc = document.getElementById("rfc");
const passwd = document.getElementById("inputPasswd");
const passwd2 = document.getElementById("passwd2");

class Usuario {
    constructor(nombre, email, rfc, passwd) {
        this.nombre = nombre;
        this.email = email;
        this.rfc = rfc;
        this.passwd = passwd;
        this.direccion = "";
        this.web = "";
        this.telefono = "";
    }
    crearUsuario() {
        var nuevoUsuario = new Usuario(nombre.value, email.value, rfc.value, passwd.value);
        return nuevoUsuario;
    }
    guardarUsuarios(newUsr) {
        let usrActuales = this.cargarUsuarios();
        usrActuales = [...usrActuales, newUsr,];
        localStorage.setItem("Usuarios", JSON.stringify(usrActuales));
    }
    cargarUsuarios() {
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
    inicioSesion(email) {
        /*En este punto de la ejecución los datos ya han sido validados 
        por lo tanto solo los guardaremos y crearemos una sesión.*/
        let usrEmail = email;
        let usrActuales = this.cargarUsuarios();
        //Obtenemos solo el usuario que esta iniciando sesión
        const usrSesion = usrActuales.find(usuario => usuario.email === usrEmail);
        //Creamos la sesión
        sessionStorage.setItem('Sesion', JSON.stringify(usrSesion));
        // Ahora nos dirijimos al menú de la app
        window.location.replace("menu.html");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    usr = new Usuario();
    console.table(usr.cargarUsuarios());
});

if (window.location.pathname === '/index.html') {
    form.addEventListener('submit', (e) => {
        //Evitamos el envio de forms vacios
        e.preventDefault();

        //Si todos los campos introducidos son correctos, procede agregando el usuario al almacenamiento
        if (verificaCampos()) {
            usr.guardarUsuarios(usr.crearUsuario());
            //Redireccionamiento a la pantalla de login
            window.location.replace("login.html");
        }
    });
}

function getFormValues() {
    const values = {
        valorNombre: nombre.value.trim(),
        valorEmail: email.value.trim(),
        valorRFC: rfc.value.trim(),
        valorPasswd: passwd.value.trim(),
        valorPasswd2: passwd2.value.trim(),
    };
    return values;
}

function verificaCampos() {
    //Validacion de campos de acuerdo a la especificación de requisitos
    let values = getFormValues();
    let lleno = true;

    if (vacio(values.valorNombre)) {
        errorPara(nombre, "El nombre de usuario no puede estar vacio.");
        lleno = false;

    } else {
        correctoPara(nombre);
    }

    if (vacio(values.valorEmail)) {
        errorPara(email, "El email no puede estar vacio.");
        lleno = false;

    } else if (!verificaEmail(values.valorEmail)) {
        errorPara(email, "No es una dirección de email válida.");
        lleno = false;

    } else {
        correctoPara(email);
    }

    if (vacio(values.valorRFC)) {
        errorPara(rfc, "El RFC no puede estar vacio.");
        lleno = false;

    } else if (!verificaRFC(values.valorRFC)) {
        errorPara(rfc, "No es un RFC válido.");
        lleno = false;

    } else if (rfcDuplicado(values.valorRFC)) {
        errorPara(rfc, "Este RFC ya está registrado.");
        lleno = false;

    } else {
        correctoPara(rfc);
    }

    if (vacio(values.valorPasswd)) {
        errorPara(passwd, "Tu contraseña no puede estar vacia.");
        lleno = false;

    } else {
        correctoPara(passwd);
    }

    if (vacio(values.valorPasswd2)) {
        errorPara(passwd2, "Este campo no puede estar vacio.");
        lleno = false;

    } else if (values.valorPasswd !== values.valorPasswd2) {
        errorPara(passwd2, "Las contraseñas no coinciden");
        lleno = false;

    } else {
        correctoPara(passwd2);
    }
    return lleno;
}

function vacio(content) {
    const status = content === '' ? true : false;
    return status;
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

function verificaRFC(rfc) {
    //Cadena Regex para rfc
    return /^([A-ZÑ&]{3,4}) ?(?:- ?)?(\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])) ?(?:- ?)?([A-Z\d]{2})([A\d])$/.test(rfc);
}

function rfcDuplicado(valorRFC) {
    let usrActuales = usr.cargarUsuarios();
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
