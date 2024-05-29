// Fonction pour mettre à jour le titre de la modale
function updateModalTitle(title) {
  const modalTitle = document.querySelector(".modal-wrapper h2");
  modalTitle.textContent = title;
}

// Fonction pour valider une adresse e-mail
function isValidEmail(email) {
  const pattern = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
  return pattern.test(email);
}

// Fonction pour afficher la bannière
function showBanner() {
  const banner = document.querySelector(".banner");
  banner.style.display = "";
}

// Fonction pour afficher le lien d'ouverture de la modale
function showOpenModif() {
  const openModalLink = document.getElementById("openModalLink");
  openModalLink.style.display = "";
}

// Fonction pour afficher le bouton de déconnexion
function showbuttonlogout() {
  const loginLink = document.getElementById("loginLink");
  loginLink.textContent = "logout";
  loginLink.href = "#";
  loginLink.addEventListener("click", logoutHandler);
}

// Fonction pour afficher le bouton de connexion
function showbuttonlogin() {
  const loginLink = document.getElementById("loginLink");
  loginLink.textContent = "login";
  loginLink.href = "login.html";
}

// Fonction pour envoyer l'e-mail et le mot de passe lors de la connexion
function sendEmailAndPassword(event) {
  event.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const loginData = { email: email, password: password };

  if (!isValidEmail(email)) {
    alert("Veuillez saisir une adresse e-mail valide.");
    return;
  }

  fetch("http://localhost:5678/api/users/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(loginData),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Erreur réponse réseau " + response.statusText);
      }
      return response.json();
    })
    .then((data) => {
      if (data.token) {
        localStorage.setItem("token", data.token);
        alert("Connexion réussie!");
        window.location.href = "index.html";
      } else {
        alert("Erreur de connexion: " + (data.message || "Aucun token reçu"));
      }
    })
    .catch((error) => {
      console.error("Erreur:", error);
      alert("Adresse mail ou mot de passe incorrect");
    });
}

// Fonction pour gérer la déconnexion
function logoutHandler(event) {
  event.preventDefault();
  localStorage.removeItem("token");
  alert("Déconnecté!");

  const loginLink = document.getElementById("loginLink");
  loginLink.textContent = "login";
  loginLink.href = "login.html";
  loginLink.removeEventListener("click", logoutHandler);
  window.location.reload();
}

// Fonctions pour gérer la modale
function setupModal() {
  const modal = document.getElementById("modal");
  const openModalLink = document.getElementById("openModalLink");
  const closeModalBtns = modal.querySelectorAll(".close-btn");
  const addPhotoBtn = modal.querySelector(".btn-add-photo");
  const backBtn = modal.querySelector(".back-btn");

  // Ouvrir la modale
  openModalLink.addEventListener("click", function (event) {
    event.preventDefault();
    modal.classList.add("show");
    modal.setAttribute("aria-hidden", "false");
    updateModalTitle("Galerie photo");
  });

  // Fermer la modale en cliquant sur le bouton de fermeture
  closeModalBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      modal.classList.remove("show");
      modal.setAttribute("aria-hidden", "true");
    });
  });

  // Fermer la modale en cliquant en dehors de celle-ci
  window.addEventListener("click", function (event) {
    if (event.target === modal) {
      modal.classList.remove("show");
      modal.setAttribute("aria-hidden", "true");
    }
  });

  // Aller à la page d'ajout de photo depuis la modale
  addPhotoBtn.addEventListener("click", function () {
    document.getElementById("mainPage").classList.add("hidden");
    document.getElementById("addPhotoPage").classList.remove("hidden");
    updateModalTitle("Ajout photo");
  });

  // Revenir à la galerie depuis la page d'ajout de photo
  backBtn.addEventListener("click", function () {
    document.getElementById("mainPage").classList.remove("hidden");
    document.getElementById("addPhotoPage").classList.add("hidden");
    updateModalTitle("Galerie photo");
  });
}

// Fonction principale d'initialisation
function initialize() {
  const loginForm = document.getElementById("loginForm");
  const connected = localStorage.getItem("token");

  if (connected) {
    showbuttonlogout();
    showBanner();
    showOpenModif();
    setupModal();
  } else {
    showbuttonlogin();
    if (loginForm) {
      loginForm.addEventListener("submit", sendEmailAndPassword);
    }
  }
}

// Exécuter la fonction d'initialisation lorsque le DOM est chargé
document.addEventListener("DOMContentLoaded", initialize);
