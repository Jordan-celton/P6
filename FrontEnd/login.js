document.addEventListener("DOMContentLoaded", function () {
  console.log("Le DOM est chargé.");

  // Gestionnaire d'événement pour le formulaire de connexion
  document
    .getElementById("loginForm")
    .addEventListener("submit", function (event) {
      event.preventDefault();
      console.log("Soumission du formulaire de connexion.");
      login();
    });

  // Fonction de connexion
  function login() {
    console.log("Appel de la fonction login");
    let emailValue = document.getElementById("email").value;
    let passwordValue = document.getElementById("password").value;

    if (
      emailValue !== undefined &&
      passwordValue !== undefined &&
      isValidEmail(emailValue)
    ) {
      const body = { email: emailValue, password: passwordValue };
      console.log(body);
      console.log(JSON.stringify(body));
      fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify({ email: emailValue, password: passwordValue }),
      })
        .then((res) => {
          if (res.ok) {
            return res.json();
          } else {
            alert("Nom utilisateur - mot de passe incorrect.");
            return Promise.reject("Nom utilisateur - mot de passe incorrect.");
          }
        })
        .then((value) => {
          localStorage.setItem("isLoggedIn", "true"); // Indique que l'utilisateur est connecté
          localStorage.setItem("token", value.token); // Stocke le token
          console.log("Connexion réussie. Redirection vers index.html");
          window.location.href = "index.html";
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      alert("Nom utilisateur - mot de passe incorrect.");
    }
  }

  // Fonction de validation de l'email
  function isValidEmail(email) {
    const pattern = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    return pattern.test(email);
  }

  // Vérifie si l'utilisateur est connecté
  const isLoggedIn = localStorage.getItem("isLoggedIn");

  // Sélectionne l'élément de navigation pour le bouton de connexion
  const loginNavItem = document.querySelector("#loginNavItem");

  // Si l'utilisateur est connecté, affiche le bouton de déconnexion
  if (isLoggedIn === "true") {
    const logoutLink = document.createElement("a");
    logoutLink.href = "#";
    logoutLink.textContent = "logout";
    logoutLink.addEventListener("click", function () {
      // Déconnexion de l'utilisateur : supprime le token et marque comme déconnecté
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("token");
      // Recharge la page pour refléter le changement
      location.reload();
    });
    loginNavItem.innerHTML = ""; // Efface le contenu précédent
    loginNavItem.appendChild(logoutLink);
  }
});
