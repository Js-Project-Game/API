// Récupération des éléments HTML
const loginBtn = document.getElementById("Host");
const signinBtn = document.getElementById("Join");

// Ajout d'un événement de clic pour chaque bouton
loginBtn.addEventListener("click", function() {
    //open ./login.html
    // window.location = './login.html';
    window.location = 'Host/host.html';
});

signinBtn.addEventListener("click", function() {
    window.location = './signing.html';
});