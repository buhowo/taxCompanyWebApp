// jshint esversion:6
if (window.location.pathname === '/login.html') {
    form.addEventListener('submit', (e) => {
        //Evitamos el envio de forms vacios
        e.preventDefault();
        //Avanza solo cuando este completos los campos
        if (verificaCampos()) {
            usr.inicioSesion(email.value);
        }
    });
}

function verificaCampos() {
    let valores = getFormValues();
    let lleno = true;

    if (vacio(valores.valorEmail)) {
        errorPara(email, "El email no puede estar vacio.");
        lleno = false;

    } else if (!verificaEmail(valores.valorEmail)) {
        errorPara(email, "No es una dirección de email válida.");
        lleno = false;

    } else if (!emailExiste(valores.valorEmail)) {
        errorPara(email, "No existe una cuenta asociada a este email.");
        lleno = false;

    } else {
        correctoPara(email);
    }

    if (vacio(valores.valorPasswd)) {
        errorPara(passwd, "Tu contraseña no puede estar vacia.");
        lleno = false;

    } else if (!matchPasswd(valores.valorEmail, valores.valorPasswd)) {
        errorPara(passwd, "Tu contraseña y tu email no coinciden.");
        lleno = false;

    } else {
        correctoPara(passwd);
    }
    return lleno;
}

function getFormValues() {
    const values = {
        valorEmail: email.value,
        valorPasswd: passwd.value
    };
    return values;
}

function emailExiste(valorEmail) {
    let usrActuales = usr.cargarUsuarios();
    if (usrActuales.length > 0) {
        //Buscamos en el array usrActuales si existe el email
        let emailUsr = usrActuales.find(usuario => usuario.email === valorEmail);

        //Si esta indefinido significa que es una cuenta no registrada
        if (typeof emailUsr !== "undefined") {
            return true;
        }
    }
    return false;
}

function matchPasswd(valorEmail, valorPasswd) {
    let usrActuales = usr.cargarUsuarios();
    if (usrActuales.length > 0) {
        //Buscamos el objeto que coincida con el email y la contraseña ingresada
        let campos = usrActuales.find(usuario => usuario.email === valorEmail && usuario.passwd === valorPasswd);

        //Si esta indefinido no existe tal objeto, por lo tanto el email y contraseña no coinciden
        if (typeof campos === "undefined") {
            return false;
        }
    }
    return true;
}   