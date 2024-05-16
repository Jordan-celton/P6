function isValidEmail(email) {
  // Pattern de l'adresse e-mail
  const pattern = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
  // Test de l'adresse e-mail avec la regex
  console.log(pattern.test(email));
  return pattern.test(email);
}

function showBanner() {
  const banner = document.querySelector(".banner");
  banner.style.display = "";
}

function hideBanner() {
  const banner = document.querySelector(".banner");
  banner.style.display = "none";
}

function logoutHandler(event) {
  const loginLink = document.getElementById("loginLink");
  event.preventDefault();
  // Logique de déconnexion
  localStorage.removeItem("token");
  alert("Déconnecté!");
  loginLink.textContent = "login";
  loginLink.href = "login.html";
  loginLink.removeEventListener("click", logoutHandler);
  hideBanner();

  // Réinitialiser la liste de filtres en supprimant l'élément <ul> de la section portfolio
  const filterList = document.querySelector(".filter");
  if (filterList) {
    filterList.parentNode.removeChild(filterList);
  }

  // Recharger la page pour réafficher la liste de travaux
  window.location.reload();
}
function showbuttonlogout() {
  const loginLink = document.getElementById("loginLink");
  // Si l'utilisateur est connecté, affichez le bouton de déconnexion
  loginLink.textContent = "logout";
  loginLink.href = "#";
  loginLink.addEventListener("click", logoutHandler);
}

function showbuttonlogin() {
  const loginLink = document.getElementById("loginLink");
  loginLink.textContent = "login";
  loginLink.href = "login.html";
}

function sendEmailAndPassword(event) {
  event.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const loginData = {
    email: email,
    password: password,
  };

  if (!isValidEmail(email)) {
    alert("Veuillez saisir une adresse e-mail valide.");
    return;
  }

  fetch("http://localhost:5678/api/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(loginData),
  })
    .then((response) => {
      // console.log("Response status:", response.status);
      if (!response.ok) {
        throw new Error("Erreur réponse réseau " + response.statusText);
      }
      return response.json();
    })
    .then((data) => {
      console.log("affichage token:", data);
      if (data.token) {
        // Stocker le token
        localStorage.setItem("token", data.token);
        alert("Connexion réussie!");
        window.location.href = "index.html"; // Rediriger vers la page d'accueil après connexion
      } else {
        // Échec de la connexion
        alert("Erreur de connexion: " + (data.message || "Aucun token reçu"));
      }
    })
    .catch((error) => {
      console.error("Erreur:", error);
      alert("Adresse mail ou mot de passe incorrect");
    });
}

document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("loginForm");
  const loginLink = document.getElementById("loginLink");
  const banner = document.querySelector(".banner");

  // Vérifiez si l'utilisateur est connecté
  const connected = localStorage.getItem("token");
  if (connected) {
    // Afficher la bannière
    showbuttonlogout();
    showBanner();
  } else {
    // Si l'utilisateur n'est pas connecté, affichez le bouton de connexion
    showbuttonlogin();
    if (loginForm) {
      loginForm.addEventListener("submit", sendEmailAndPassword);
    }
  }
});
