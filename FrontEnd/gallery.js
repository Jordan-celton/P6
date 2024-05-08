// Attendre que le DOM soit entièrement chargé
document.addEventListener("DOMContentLoaded", function () {
  // Récupérer les travaux de l'architecte depuis l'API
  fetch("http://localhost:5678/api/works")
    .then((res) => res.json())
    .then((data) => {
      // console.log(data);

      // Sélectionner la galerie
      const gallery = document.querySelector(".gallery");
      // console.log(gallery);

      // Parcourir les données sur les travaux
      data.forEach((work) => {
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
    });
});

//---------------------------------------------------------------------------------------------
// Fonction pour créer la liste de filtres et l'ajouter avant la galerie
function createFilterList() {
  // Créer l'élément ul pour la liste de filtres
  const filterList = document.createElement("ul");
  filterList.classList.add("filter");
  // console.log(filterList);

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
    // console.log(filterItem);
  });

  // Sélectionner la section portfolio
  const portfolioSection = document.getElementById("portfolio");

  // Sélectionner la galerie
  const gallery = portfolioSection.querySelector(".gallery");

  // Je positionne la liste de filtres avant la galerie
  portfolioSection.insertBefore(filterList, gallery);
}

// Attendre que le DOM soit entièrement chargé
document.addEventListener("DOMContentLoaded", function () {
  // Appeler la fonction pour créer la liste de filtres et l'ajouter avant la galerie
  createFilterList();
});

//---------------------------------------------------------------------------------------------
