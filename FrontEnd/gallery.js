// Fonction pour créer un élément figure avec une image et une légende
function createFigureElement(work) {
  const figureElement = document.createElement("figure");

  const imageElement = document.createElement("img");
  imageElement.src = work.imageUrl;
  imageElement.alt = work.title;

  const figcaptionElement = document.createElement("figcaption");
  figcaptionElement.textContent = work.title;

  figureElement.appendChild(imageElement);
  figureElement.appendChild(figcaptionElement);

  return figureElement;
}

// Fonction pour ajouter une icône de poubelle à une figure
function addTrashIcon(figureElement, workId) {
  const trashIcon = document.createElement("i");
  trashIcon.classList.add("fa-solid", "fa-trash-can");

  // Ajouter un gestionnaire d'événements pour supprimer l'élément figure au clic
  trashIcon.addEventListener("click", async function () {
    try {
      await deleteWorkById(workId);
      figureElement.remove();
      alert("Travail supprimé avec succès.");
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur lors de la suppression du travail.");
    }
  });

  figureElement.appendChild(trashIcon);
}

// Fonction pour supprimer un travail par ID
async function deleteWorkById(workId) {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Vous devez être connecté pour supprimer des travaux.");
    return;
  }

  const response = await fetch(`http://localhost:5678/api/works/${workId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(
      "Erreur lors de la suppression du travail: " + response.statusText
    );
  }
}

// Fonction pour afficher les travaux dans une galerie donnée
function displayWorks(works, gallerySelector) {
  const gallery = document.querySelector(gallerySelector);
  gallery.innerHTML = "";

  works.forEach((work) => {
    const figureElement = createFigureElement(work);
    gallery.appendChild(figureElement);
  });
}

// Fonction pour afficher les travaux dans la galerie modale
function displayWorksInModal(works) {
  const modalGallery = document.querySelector(".modal-gallery");
  modalGallery.innerHTML = ""; // Supprimer le contenu précédent de la galerie modale

  works.forEach((work) => {
    const figureElement = createFigureElement(work);

    // Ajouter la classe CSS pour cacher le texte
    const figcaptionElement = figureElement.querySelector("figcaption");
    figcaptionElement.classList.add("hidden-text");

    addTrashIcon(figureElement, work.id);
    modalGallery.appendChild(figureElement);
  });
}

// Fonction pour créer la liste de filtres et l'ajouter avant la galerie
function createFilterList(data) {
  const filterList = document.createElement("ul");
  filterList.classList.add("filter");

  const filterNames = [
    "Tous",
    "Objets",
    "Appartements",
    "Hotels & restaurants",
  ];

  filterNames.forEach((name) => {
    const filterItem = document.createElement("li");
    filterItem.textContent = name;
    filterList.appendChild(filterItem);
  });

  const portfolioSection = document.getElementById("portfolio");
  const gallery = portfolioSection.querySelector(".gallery");
  portfolioSection.insertBefore(filterList, gallery);

  filterList.addEventListener("click", (event) => {
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
      displayWorks(filteredWorks, ".gallery");
    }
  });
}

document.addEventListener("DOMContentLoaded", function () {
  // Masquer la bannière
  const modal = document.getElementById("openModalLink");
  modal.style.display = "none";
  const banner = document.querySelector(".banner");
  banner.style.display = "none";

  // Récupérer les travaux de l'architecte depuis l'API
  fetch("http://localhost:5678/api/works")
    .then((res) => res.json())
    .then((data) => {
      const token = localStorage.getItem("token");
      if (!token) {
        createFilterList(data);
      }

      displayWorks(data, ".gallery");
      displayWorksInModal(data);
    });
});
