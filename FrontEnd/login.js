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

function setupModal() {
  const modal = document.getElementById("modal");
  const openModalLink = document.getElementById("openModalLink");
  const closeModalBtn = modal.querySelector(".close-btn");

  openModalLink.addEventListener("click", function (event) {
    event.preventDefault();
    modal.classList.add("show");
    modal.setAttribute("aria-hidden", "false");
  });

  closeModalBtn.addEventListener("click", function () {
    modal.classList.remove("show");
    modal.setAttribute("aria-hidden", "true");
  });

  window.addEventListener("click", function (event) {
    if (event.target === modal) {
      modal.classList.remove("show");
      modal.setAttribute("aria-hidden", "true");
    }
  });
}

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

document.addEventListener("DOMContentLoaded", function () {
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
});
