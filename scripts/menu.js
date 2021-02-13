// jshint esversion:6
document.addEventListener("DOMContentLoaded", saludo());

function saludo() {
    //Aqui verificamos que exista una sesion activa
    let usr = getUserInfo();
    if (!usr) {
        //De no ser el caso redirigimos a la pantalla de login
        alert("¡Sesión expirada!");
        window.location.replace("login.html");
    } else {
        // alert("Bienvenido " + usr.nombre + "!");
        document.title = "Menú de " + usr.nombre;
        document.querySelector("h2").innerHTML = "Menú para <strong>" + usr.nombre + "</strong>";
        mostrarInfo();
    }
}

function mostrarInfo(){
    //Aqui desplegamos la info del usuario en sesion en dos tablas
    let usr = getUserInfo();
    const listOne = document.querySelector('#user-data-one');
    
    const rowOne = document.createElement('tr');
    
    rowOne.innerHTML = `
      <td>${usr.nombre}</td>
      <td>${usr.rfc}</td>
      <td>${usr.direccion}</td>
    `;
    listOne.appendChild(rowOne);
    
    const listTwo = document.querySelector('#user-data-two');
    
    const rowTwo = document.createElement('tr');
    
    rowTwo.innerHTML = `
      <td>${usr.telefono}</td>
      <td>${usr.website}</td>
    `;
    listTwo.appendChild(rowTwo);
}

document.getElementById("btn-conf").addEventListener("click", (e) =>{
    // e.target.parentElement.classList.add("hide");
    window.location.replace("actualizaDatos.html");
});

document.getElementById("btn-algo").addEventListener("click", (e) =>{
    //Preguntamos las N palabras y hacemos un parse a Int
    alert("Evaluador de palindromos");
    var nPalabras = parseInt(prompt("Escribe el número de palabras/frases que vas a ingresar"), 10);
    let palabras = [];
    
    //Leemos palabras
    for (let i = 0; i < nPalabras; i++){
        palabras[i] = prompt("Palabra #" + (i+1)).toLowerCase();
    }
    //Evaluamos cada una
    for (let i = 0; i < palabras.length; i++){
        let resultado = palindromo(palabras[i]);
        alert(palabras[i] + ": " + resultado);
    }

    function palindromo(palabra){
        // Paso la palabra a minusculas y quito espacios
        palabra = palabra.replace(/\s/g, "");
        /* Creo otra palabra partiendo de la de original pero
         en array, invierto al array y lo paso a string*/
        palabraInvertida = palabra.split("").reverse().toString();
        // Le quito las "," con un remplace dentro del for
        // Lo igualo a -1 ya que tiene una coma menos que el número total de letras
        for (var i = 0; i < ((palabraInvertida.length) - 1); i++) {
            palabraInvertida = palabraInvertida.replace(",", "");
        }
        // Comparo las dos frases.
        if (palabra == palabraInvertida) {
            // Si el resultado es positivo
            return "es un Palindromo";
        }
        else {
            // Si el resultado es negativo
            return "no es un Palindromo";
        }
    }

});

function getUserInfo() {
    return JSON.parse(sessionStorage.getItem("Sesion"));
}