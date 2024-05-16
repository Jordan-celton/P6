// Fonction pour afficher les travaux dans la galerie
function displayWorks(works) {
  // Sélectionner la galerie
  const gallery = document.querySelector(".gallery");
  // Supprime tous les éléments enfants de la galerie
  gallery.innerHTML = "";
  // Parcourir les travaux filtrés et les ajouter à la galerie
  works.forEach((work) => {
    // Créer un élément figure pour chaque travail
    const figureElement = document.createElement("figure");

    // Créer un élément image et définir ses attributs src et alt
    const imageElement = document.createElement("img");
    imageElement.src = work.imageUrl;
    imageElement.alt = work.title;

    // Créer un élément figcaption
    const figcaptionElement = document.createElement("figcaption");
    figcaptionElement.textContent = work.title;

    // Ajouter l'image et le titre à l'élément figure
    figureElement.appendChild(imageElement);
    figureElement.appendChild(figcaptionElement);

    // Ajouter l'élément figure à la div gallery
    gallery.appendChild(figureElement);
  });
}

// Fonction pour créer la liste de filtres et l'ajouter avant la galerie
function createFilterList(data) {
  // Créer l'élément ul pour la liste de filtres
  const filterList = document.createElement("ul");
  filterList.classList.add("filter");

  // Liste des noms de filtres
  const filterNames = [
    "Tous",
    "Objets",
    "Appartements",
    "Hotels & restaurants",
  ];

  // Parcourir les noms de filtres et créer les éléments li correspondants
  filterNames.forEach((name) => {
    const filterItem = document.createElement("li");
    filterItem.textContent = name;
    filterList.appendChild(filterItem);
  });

  // Sélectionne la section portfolio
  const portfolioSection = document.getElementById("portfolio");

  // Sélectionne la classe gallery
  const gallery = portfolioSection.querySelector(".gallery");

  // Ajout de la liste de filtres avant la galerie
  portfolioSection.insertBefore(filterList, gallery);

  // Ajout de l'écouteur d'événements au clic à la liste de filtres
  filterList.addEventListener("click", (event) => {
    // console.log(event);
    if (event.target.tagName === "LI") {
      const categoryName = event.target.textContent;
      let filteredWorks = [];
      if (categoryName === "Tous") {
        filteredWorks = data;
      } else {
        filteredWorks = data.filter(
          (work) => work.category.name === categoryName
        );
      }
      // Appelle de la fonction pour afficher les travaux filtrés
      displayWorks(filteredWorks);
    }
  });
}

document.addEventListener("DOMContentLoaded", function () {
  // Masquer la bannière
  const banner = document.querySelector(".banner");
  banner.style.display = "none";

  // Récupérer les travaux de l'architecte depuis l'API
  fetch("http://localhost:5678/api/works")
    .then((res) => res.json())
    .then((data) => {
      // Vérifier si l'utilisateur est connecté avant de créer la liste de filtres
      const token = localStorage.getItem("token");
      if (!token) {
        // Si l'utilisateur n'est pas connecté, appelle de la fonction pour créer la liste de filtres
        createFilterList(data);
      }

      // Appelle de la fonction pour afficher les travaux
      displayWorks(data);
    });
});
