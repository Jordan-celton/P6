document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("loginForm");
  const loginLink = document.getElementById("loginLink");

  function isValidEmail(email) {
    // Pattern de l'adresse e-mail
    const pattern = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    // Test de l'adresse e-mail avec la regex
    console.log(pattern.test(email));
    return pattern.test(email);
  }

  // Vérifiez si l'utilisateur est connecté
  const token = localStorage.getItem("token");
  if (token) {
    // Si l'utilisateur est connecté, affichez le bouton de déconnexion
    loginLink.textContent = "logout";
    loginLink.href = "#";
    loginLink.addEventListener("click", function logoutHandler(event) {
      event.preventDefault();
      // Logique de déconnexion
      localStorage.removeItem("token");
      alert("Déconnecté!");
      loginLink.textContent = "login";
      loginLink.href = "login.html";
      loginLink.removeEventListener("click", logoutHandler);
    });
  } else {
    // Si l'utilisateur n'est pas connecté, affichez le bouton de connexion
    loginLink.textContent = "login";
    loginLink.href = "login.html";
  }

  if (loginForm) {
    loginForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      if (!isValidEmail(email)) {
        alert("Veuillez saisir une adresse e-mail valide.");
        return;
      }

      const loginData = {
        email: email,
        password: password,
      };
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
            throw new Error(
              "Network response was not ok " + response.statusText
            );
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
            alert(
              "Erreur de connexion: " + (data.message || "Aucun token reçu")
            );
          }
        })
        .catch((error) => {
          console.error("Erreur:", error);
          alert("Adresse mail ou mot de passe incorrect");
        });
    });
  }
});
