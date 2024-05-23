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

  // Ajout d'un gestionnaire d'événements pour supprimer l'élément figure au clic
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

// Fonction pour vérifier si tous les champs du formulaire sont remplis
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

function initializeModal() {
  const modal = document.getElementById("modal");

  // Cacher le lien pour ouvrir la modale si l'utilisateur est déconnecté
  const openModalLink = document.getElementById("openModalLink");
  const connected = localStorage.getItem("token");
  if (!connected) {
    openModalLink.style.display = "none";
  }

  // Ouverture de la modale
  openModalLink.addEventListener("click", (event) => {
    event.preventDefault();
    modal.style.display = "block";
  });

  // Fermeture de la modale
  const closeButtons = document.querySelectorAll(".close-btn");
  closeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      modal.style.display = "none";
    });
  });

  window.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });

  // Navigation entre les pages de la modale
  const mainPage = document.getElementById("mainPage");
  const addPhotoPage = document.getElementById("addPhotoPage");
  const addPhotoButton = document.querySelector(".btn-add-photo");
  const backButton = document.querySelector(".back-btn");
  const btn2AddPhoto = document.querySelector(".btn2-add-photo");
  const photoInput = document.getElementById("photoInput");
  const photoPreview = document.getElementById("photoPreview");
  const btnValidate = document.querySelector(".btn-validate");

  addPhotoButton.addEventListener("click", () => {
    mainPage.classList.add("hidden");
    addPhotoPage.classList.remove("hidden");
  });

  backButton.addEventListener("click", () => {
    addPhotoPage.classList.add("hidden");
    mainPage.classList.remove("hidden");
  });

  btn2AddPhoto.addEventListener("click", () => {
    photoInput.click();
  });

  photoInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        photoPreview.src = e.target.result;
        photoPreview.style.display = "block";

        // Cacher les éléments .btn2-add-photo et p
        const elementsToHide = document.querySelectorAll(
          ".btn2-add-photo, .text-btn"
        );
        elementsToHide.forEach((element) => {
          element.style.display = "none";
        });
      };
      reader.readAsDataURL(file);
    } else {
      photoPreview.style.display = "none";
    }
    checkFormValidity();
  });

  document
    .getElementById("nom_photo")
    .addEventListener("input", checkFormValidity);
  document
    .getElementById("categorie")
    .addEventListener("change", checkFormValidity);

  btnValidate.addEventListener("click", async () => {
    const title = document.getElementById("nom_photo").value;
    const category = document.getElementById("categorie").value;

    if (!title || !category || !photoInput.files[0]) {
      alert("Veuillez remplir tous les champs et sélectionner une photo.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("category", category);
    formData.append("image", photoInput.files[0]);

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

      // Réinitialiser le formulaire et revenir à la page principale de la modale
      document.getElementById("photoForm").reset();
      photoPreview.style.display = "none";
      mainPage.classList.remove("hidden");
      addPhotoPage.classList.add("hidden");

      // Cacher les éléments i, button, et p
      const elementsToHide = document.querySelectorAll("i, button, .text-btn");
      elementsToHide.forEach((element) => {
        element.style.display = "none";
      });

      // Réinitialiser la couleur du bouton après succès
      btnValidate.classList.remove("success");

      alert("Photo ajoutée avec succès.");
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur lors de l'ajout de la photo.");
    }
  });
}

document.addEventListener("DOMContentLoaded", function () {
  const banner = document.querySelector(".banner");
  if (banner) {
    banner.style.display = "none";
  }

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
      initializeModal();
    });
});
