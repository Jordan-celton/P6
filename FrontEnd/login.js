// Fonctions Utilitaires
function isValidEmail(email) {
  const pattern = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
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

function showOpenModif() {
  const openModalLink = document.getElementById("openModalLink");
  openModalLink.style.display = "";
}

function updateModalTitle(title) {
  const modalTitle = document.querySelector(".modal-wrapper h2");
  modalTitle.textContent = title;
}

// Fonctions de Gestion de la Modale
function setupModal() {
  const modal = document.getElementById("modal");
  const openModalLink = document.getElementById("openModalLink");
  const closeModalBtns = modal.querySelectorAll(".close-btn");
  const addPhotoBtn = modal.querySelector(".btn-add-photo");
  const backBtn = modal.querySelector(".back-btn");

  openModalLink.addEventListener("click", function (event) {
    event.preventDefault();
    modal.classList.add("show");
    modal.setAttribute("aria-hidden", "false");
    updateModalTitle("Galerie photo");
  });

  closeModalBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      modal.classList.remove("show");
      modal.setAttribute("aria-hidden", "true");
    });
  });

  window.addEventListener("click", function (event) {
    if (event.target === modal) {
      modal.classList.remove("show");
      modal.setAttribute("aria-hidden", "true");
    }
  });

  addPhotoBtn.addEventListener("click", function () {
    document.getElementById("mainPage").classList.add("hidden");
    document.getElementById("addPhotoPage").classList.remove("hidden");
    updateModalTitle("Ajout photo");
  });

  backBtn.addEventListener("click", function () {
    document.getElementById("mainPage").classList.remove("hidden");
    document.getElementById("addPhotoPage").classList.add("hidden");
    updateModalTitle("Galerie photo");
  });
}

// Fonctions de Connexion/Déconnexion
function logoutHandler(event) {
  event.preventDefault();
  localStorage.removeItem("token");
  alert("Déconnecté!");

  const loginLink = document.getElementById("loginLink");
  loginLink.textContent = "login";
  loginLink.href = "login.html";
  loginLink.removeEventListener("click", logoutHandler);

  hideBanner();

  const filterList = document.querySelector(".filter");
  if (filterList) {
    filterList.parentNode.removeChild(filterList);
  }

  window.location.reload();
}

function showbuttonlogout() {
  const loginLink = document.getElementById("loginLink");
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

// Fonction principale
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

document.addEventListener("DOMContentLoaded", initialize);
