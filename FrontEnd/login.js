function login() {
  console.log("appel fonction login");
  //je récupère les valeurs des champs utilisateurs et mot de passe
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
          return 0;
        }
      })
      .then((value) => {
        if (value !== 0) {
          localStorage.setItem("token", value.token);
          console.log(value.token);
          window.location.href = "index.html";
        }
      });
  } else {
    alert("Nom utilisateur - mot de passe incorrect.");
  }
}

function isValidEmail(email) {
  // Pattern de l'adresse e-mail
  const pattern = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
  // Test de l'adresse e-mail avec la regex
  console.log(pattern.test(email));
  return pattern.test(email);
}

document
  .getElementById("loginForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    login();
  });
