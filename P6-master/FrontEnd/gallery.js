// Mapping des catégories avec leurs valeurs associées
const categoryMapping = {
  Objets: 1,
  Appartements: 2,
  "Hotels & restaurants": 3,
};

// Fonction pour obtenir la valeur de la catégorie à partir du texte
function getCategoryValue(categoryText) {
  return categoryMapping[categoryText] || null;
}

// Fonction pour créer un élément <figure> avec une image et une légende
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

// Fonction pour ajouter une icône de poubelle à un élément <figure>
function addTrashIcon(figureElement, workId) {
  const trashIcon = document.createElement("i");
  trashIcon.classList.add("fa-solid", "fa-trash-can", "trash-icon");

  trashIcon.addEventListener("click", async () => {
    try {
      await deleteWorkById(workId);
      getDataAndDisplay();
      alert("Travail supprimé avec succès.");
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur lors de la suppression du travail.");
    }
  });

  figureElement.appendChild(trashIcon);
}

// Fonction pour supprimer un travail par son ID
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

// Fonction pour afficher les travaux dans une galerie
function displayWorks(works, gallerySelector) {
  const gallery = document.querySelector(gallerySelector);
  gallery.innerHTML = "";

  works.forEach((work) => {
    const figureElement = createFigureElement(work);
    gallery.appendChild(figureElement);
  });
}

// Fonction pour afficher les travaux dans une galerie modale
function displayWorksInModal(works) {
  const modalGallery = document.querySelector(".modal-gallery");
  modalGallery.innerHTML = "";

  works.forEach((work) => {
    const figureElement = createFigureElement(work);
    const figcaptionElement = figureElement.querySelector("figcaption");
    figcaptionElement.classList.add("hidden-text");

    addTrashIcon(figureElement, work.id);
    modalGallery.appendChild(figureElement);
  });
}

// Fonction pour créer la liste des filtres de catégories
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
      const filteredWorks =
        categoryName === "Tous"
          ? data
          : data.filter((work) => work.category.name === categoryName);
      displayWorks(filteredWorks, ".gallery");
    }
  });
}

// Fonction pour vérifier la validité du formulaire
function checkFormValidity() {
  const title = document.getElementById("nom_photo").value;
  const category = document.getElementById("categorie").value;
  const photo = document.getElementById("photoInput").files[0];
  const btnValidate = document.querySelector(".btn-validate");

  if (title && category && photo) {
    btnValidate.classList.add("success");
  } else {
    btnValidate.classList.remove("success");
  }
}

// Fonction pour réinitialiser le modal d'ajout de photo
function resetAddPhotoModal() {
  const photoInput = document.getElementById("photoInput");
  const photoPreview = document.getElementById("photoPreview");
  const btnValidate = document.querySelector(".btn-validate");
  const elementsToShow = document.querySelectorAll(
    ".btn2-add-photo, .text-btn"
  );

  document.getElementById("photoForm").reset();
  photoPreview.style.display = "none";
  photoPreview.src = "";

  document.querySelectorAll("figcaption").forEach((figcaption) => {
    figcaption.classList.add("hidden-text");
  });

  elementsToShow.forEach((element) => {
    element.style.display = "block";
  });

  btnValidate.classList.remove("success");
}

// Fonction pour gérer l'ajout d'une photo
async function handleAddPhoto() {
  const title = document.getElementById("nom_photo").value;
  const category = document.getElementById("categorie").value;
  const photo = document.getElementById("photoInput").files[0];

  if (!title || !category || !photo) {
    alert("Veuillez remplir tous les champs et sélectionner une photo.");
    return;
  }

  const formData = new FormData();
  formData.append("title", title);
  formData.append("category", getCategoryValue(category));
  formData.append("image", photo);

  try {
    const response = await fetch("http://localhost:5678/api/works", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(
        "Erreur lors de l'ajout du travail: " + response.statusText
      );
    }

    const newWork = await response.json();

    const gallery = document.querySelector(".gallery");
    const modalGallery = document.querySelector(".modal-gallery");

    const figureElement = createFigureElement(newWork);
    gallery.appendChild(figureElement);

    const modalFigureElement = createFigureElement(newWork);
    addTrashIcon(modalFigureElement, newWork.id);
    modalGallery.appendChild(modalFigureElement);

    resetAddPhotoModal();
    document.getElementById("mainPage").classList.remove("hidden");
    document.getElementById("addPhotoPage").classList.add("hidden");

    document
      .querySelectorAll(".btn2-add-photo, .text-btn")
      .forEach((element) => {
        element.style.display = "block";
      });

    alert("Photo ajoutée avec succès.");
  } catch (error) {
    console.error("Erreur:", error);
    alert("Erreur lors de l'ajout de la photo.");
  }
}

// Fonction pour afficher le modal
function showModal(event) {
  event.preventDefault();
  modal.style.display = "block";
}

// Fonction pour fermer le modal
function closeModal() {
  modal.style.display = "none";
  resetAddPhotoModal();
}

// Fonction pour fermer le modal en cliquant à l'extérieur
function closeModalOnClickOutside(event) {
  if (event.target === modal) {
    closeModal();
  }
}

// Fonction pour afficher la page d'ajout de photo
function showAddPhotoPage() {
  mainPage.classList.add("hidden");
  addPhotoPage.classList.remove("hidden");
}

// Fonction pour cacher la page d'ajout de photo
function hideAddPhotoPage() {
  addPhotoPage.classList.add("hidden");
  mainPage.classList.remove("hidden");
  resetAddPhotoModal();
}

// Fonction pour déclencher l'input de sélection de photo
function triggerPhotoInput() {
  photoInput.click();
}
// Fonction pour cacher la bannière
function hideBanner() {
  const banner = document.querySelector(".banner");
  if (banner) {
    banner.style.display = "none";
  }
}

// Fonction pour gérer le changement de l'input de photo
function handlePhotoInputChange(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      photoPreview.src = e.target.result;
      photoPreview.style.display = "block";
      document
        .querySelectorAll(".btn2-add-photo, .text-btn")
        .forEach((element) => {
          element.style.display = "none";
        });
    };
    reader.readAsDataURL(file);
  } else {
    photoPreview.style.display = "none";
  }
  checkFormValidity();
}

// Fonction pour gérer les événements de saisie ou de changement d'input
function handleInputOrChangeEvent() {
  checkFormValidity();
}

// Fonction pour initialiser le modal et ses événements
function initializeModal() {
  const modal = document.getElementById("modal");
  const mainPage = document.getElementById("mainPage");
  const addPhotoPage = document.getElementById("addPhotoPage");
  const addPhotoButton = document.querySelector(".btn-add-photo");
  const backButton = document.querySelector(".back-btn");
  const btn2AddPhoto = document.querySelector(".btn2-add-photo");
  const photoInput = document.getElementById("photoInput");
  const photoPreview = document.getElementById("photoPreview");
  const btnValidate = document.querySelector(".btn-validate");
  const openModalLink = document.getElementById("openModalLink");
  const connected = localStorage.getItem("token");

  if (!connected) {
    openModalLink.style.display = "none";
  }

  openModalLink.addEventListener("click", showModal);

  document.querySelectorAll(".close-btn").forEach((button) => {
    button.addEventListener("click", closeModal);
  });

  window.addEventListener("click", closeModalOnClickOutside);

  addPhotoButton.addEventListener("click", showAddPhotoPage);

  backButton.addEventListener("click", hideAddPhotoPage);

  btn2AddPhoto.addEventListener("click", triggerPhotoInput);

  photoInput.addEventListener("change", handlePhotoInputChange);

  document
    .getElementById("nom_photo")
    .addEventListener("input", handleInputOrChangeEvent);
  document
    .getElementById("categorie")
    .addEventListener("change", handleInputOrChangeEvent);

  btnValidate.addEventListener("click", handleAddPhoto);
}

// Fonction pour obtenir les données et les afficher
function getDataAndDisplay() {
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
}

// Initialisation de l'application au chargement du DOM
document.addEventListener("DOMContentLoaded", () => {
  // Cacher la bannière si elle est présente
  hideBanner();
  // Initialiser les éléments du modal et attacher les gestionnaires d'événements
  initializeModal();
  // Récupérer les données des travaux et les afficher dans la galerie
  getDataAndDisplay();
});
