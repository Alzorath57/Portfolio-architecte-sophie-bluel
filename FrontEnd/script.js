import { deleteWork, getCategories, getWorks, addWork } from "./api.js";

let works = [];
// Lis le token dans le local storage
const token = localStorage.getItem("token");
// Variable pour suivre la catégorie active
let activeCategory = null;

// ========== INITIALISATION ==========
async function init() {
  works = await getWorks();
  displayWorks(works);
  const categories = await getCategories();
  displayCategories(categories);
  if (token) {
    // Modifie le lien de connexion en déconnexion
    const loginLink = document.getElementById("login-link");
    loginLink.textContent = "logout";
    loginLink.addEventListener("click", function () {
      localStorage.removeItem("token");
      window.location.href = "login.html";
    });

    // Bannière de mode édition
    const editBanner = document.createElement("div");
    editBanner.id = "edit-banner";
    editBanner.innerHTML =
      '<i class="fa-regular fa-pen-to-square"></i> Mode édition';
    document.body.prepend(editBanner);

    // Bouton de modification dans le titre du portfolio
    const editButton = document.createElement("button");
    editButton.id = "edit-button";
    editButton.innerHTML =
      '<i class="fa-regular fa-pen-to-square"></i> modifier';
    document.querySelector("#portfolio-title").appendChild(editButton);

    // Création du modal
    const modal = document.createElement("div");
    modal.id = "modal";
    document.body.appendChild(modal);
    editButton.addEventListener("click", function () {
      modal.style.display = "flex";
      displayModalWorks(works);
    });

    // Contenu du modal
    const modalContent = document.createElement("div");
    modalContent.id = "modal-content";
    modal.appendChild(modalContent);

    // Bouton de fermeture du modal
    const closeButton = document.createElement("button");
    closeButton.id = "close-button";
    closeButton.textContent = "✕";
    modalContent.appendChild(closeButton);
    closeButton.addEventListener("click", function () {
      modal.style.display = "none";
      imageError.style.display = "none";
      titleError.style.display = "none";
      categoryError.style.display = "none";
    });

    // Titre du modal
    const modalTitle = document.createElement("h3");
    modalTitle.textContent = "Galerie photo";
    modalTitle.id = "modal-title";

    // Galerie d'images dans le modal
    const modalGallery = document.createElement("div");
    modalGallery.id = "modal-gallery";

    // Bouton pour afficher le formulaire d'ajout
    const addButton = document.createElement("button");
    addButton.textContent = "Ajouter une photo";
    addButton.id = "add-button";

    // Séparateur entre le contenu du modal et le bouton d'ajout
    const separator = document.createElement("hr");
    separator.id = "separator";
    const separatorForm = document.createElement("hr");
    separatorForm.id = "separator-form";

    // Modal supplémentaire pour l'ajout de photo
    const modalAdd = document.createElement("div");
    modalAdd.id = "modal-add";
    modalAdd.style.display = "none";
    addButton.addEventListener("click", function () {
      modalAdd.style.display = "block";
      modalGallery.style.display = "none";
      addButton.style.display = "none";
      separator.style.display = "none";
      modalTitle.textContent = "Ajout photo";
    });

    // Bouton de retour dans le modal d'ajout
    const backButton = document.createElement("button");
    backButton.id = "back-button";
    backButton.innerHTML = '<i class="fa-sharp fa-solid fa-arrow-left"></i>';
    modalAdd.appendChild(backButton);
    backButton.addEventListener("click", function () {
      modalAdd.style.display = "none";
      modalGallery.style.display = "grid";
      addButton.style.display = "block";
      separator.style.display = "block";
      modalTitle.textContent = "Galerie photo";
    });

    // Formulaire d'ajout de photo dans le modal
    const form = document.createElement("form");
    form.id = "add-form";
    modalAdd.appendChild(form);

    // Input pour l'image
    const imageInput = document.createElement("input");
    const imageLabel = document.createElement("label");
    const imagePreview = document.createElement("div");
    const imageError = document.createElement("p");

    // Message d'erreur pour l'image
    imageError.textContent = "Veuillez sélectionner une image.";
    imageError.style.color = "red";
    imageError.style.display = "none";

    // Configuration de l'input d'image et de son aperçu
    imagePreview.id = "image-preview";
    imageInput.style.display = "none";
    imageLabel.innerHTML =
      '<i class="fa-regular fa-image"></i><span>+ Ajouter photo</span>';
    imageLabel.htmlFor = "image-form";
    imageInput.type = "file";
    imageInput.id = "image-form";
    imageInput.name = "image";

    // Info sur les formats d'image acceptés
    const imageInfo = document.createElement("p");
    imageInfo.textContent = "jpg, png : 4mo max";

    // Affiche un aperçu de l'image sélectionnée par l'utilisateur
    imageInput.accept = "image/png, image/jpeg";

    imageInput.addEventListener("change", function () {
      if (imageInput.files[0]) {
        imageError.style.display = "none";

        // Modifie l'image existante si l'utilisateur sélectionne une nouvelle image
        const existingImage = document.getElementById("file-image");
        if (existingImage) {
          existingImage.remove();
        }
        imageInfo.style.display = "none";
        imageLabel.style.display = "none";
        const fileImage = document.createElement("img");
        fileImage.id = "file-image";
        fileImage.src = URL.createObjectURL(imageInput.files[0]);

        imagePreview.appendChild(fileImage);
        fileImage.addEventListener("click", function () {
          imageInput.click();
        });
      }
    });

    // Input pour le titre
    const titleInput = document.createElement("input");
    const titleLabel = document.createElement("label");
    const titleError = document.createElement("p");

    // Message d'erreur pour le titre
    titleError.textContent = "Le titre doit comporter au moins 2 caractères.";
    titleError.style.color = "red";
    titleError.style.display = "none";

    // Validation du titre
    titleLabel.textContent = "Titre";
    titleLabel.htmlFor = "title-form";
    titleInput.type = "text";
    titleInput.id = "title-form";
    titleInput.name = "title";
    titleInput.addEventListener("input", function () {
      if (titleInput.value.trim().length >= 2) {
        titleError.style.display = "none";
      }
    });

    // Input pour la catégorie
    const categoryselect = document.createElement("select");
    const categoryLabel = document.createElement("label");
    const categoryError = document.createElement("p");

    // Message d'erreur pour la catégorie
    categoryError.textContent = "Veuillez sélectionner une catégorie.";
    categoryError.style.color = "red";
    categoryError.style.display = "none";

    // Validation de la catégorie
    categoryLabel.textContent = "Catégorie";
    categoryLabel.htmlFor = "category-form";
    categoryselect.id = "category-form";
    categoryselect.name = "category";
    categoryselect.addEventListener("change", function () {
      if (categoryselect.value) {
        categoryError.style.display = "none";
      }
    });

    // vide les catégories par defaut et ajoute une option vide
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "";
    categoryselect.appendChild(defaultOption);

    // Récupère les catégories et les ajoute au input de sélection
    categories.forEach((category) => {
      const option = document.createElement("option");
      option.value = category.id;
      option.textContent = category.name;
      categoryselect.appendChild(option);
    });

    // Bouton de soumission du formulaire
    const submitButton = document.createElement("button");
    submitButton.textContent = "Valider";
    submitButton.id = "submit-button";

    // Événement de soumission du formulaire
    form.addEventListener("submit", async function (event) {
      event.preventDefault();
      let isValid = true;

      if (!imageInput.files[0]) {
        imageError.style.display = "block";
        isValid = false;
      } else {
        imageError.style.display = "none";
      }

      if (titleInput.value.trim().length < 2) {
        titleError.style.display = "block";
        isValid = false;
      } else {
        titleError.style.display = "none";
      }

      if (!categoryselect.value) {
        categoryError.style.display = "block";
        isValid = false;
      } else {
        categoryError.style.display = "none";
      }

      if (!isValid) return;
      const formData = new FormData();
      formData.append("image", imageInput.files[0]);
      formData.append("title", titleInput.value);
      formData.append("category", parseInt(categoryselect.value));
      titleError.style.display = "none";
      categoryError.style.display = "none";

      // Appelle la fonction d'ajout de travail et met à jour la galerie si l'ajout est réussi
      const newWork = await addWork(formData, token);
      if (newWork) {
        newWork.categoryId = parseInt(newWork.categoryId);
        works.push(newWork);
        titleInput.value = "";
        categoryselect.value = "";
        if (activeCategory) {
          displayWorks(works.filter((w) => w.categoryId === activeCategory));
        } else {
          displayWorks(works);
        }
        modalAdd.style.display = "none";
        modal.style.display = "none";
      }
    });
    editButton.addEventListener("click", function () {
      modalAdd.style.display = "none";
      modalGallery.style.display = "grid";
      addButton.style.display = "block";
      separator.style.display = "block";
      modalTitle.textContent = "Galerie photo";
      imageLabel.style.display = "flex";
      imageInfo.style.display = "block";
      const existingImage = document.getElementById("file-image");
      if (existingImage) existingImage.remove();
    });
    // Ajout des éléments dans la modale
    modalContent.appendChild(modalTitle);
    modalContent.appendChild(modalGallery);
    modalContent.appendChild(separator);
    modalContent.appendChild(addButton);
    modalContent.appendChild(modalAdd);

    // Ajout des éléments dans le formulaire
    imagePreview.appendChild(imageLabel);
    imagePreview.appendChild(imageInfo);
    imagePreview.appendChild(imageInput);
    form.appendChild(imagePreview);
    form.appendChild(imageError);
    form.appendChild(titleLabel);
    form.appendChild(titleInput);
    form.appendChild(titleError);
    form.appendChild(categoryLabel);
    form.appendChild(categoryselect);
    form.appendChild(categoryError);
    form.appendChild(separatorForm);
    form.appendChild(submitButton);
  }
}
// Affiche les travaux dans la galerie

function displayWorks(works) {
  // Vide la galerie avant d'afficher les travaux
  const gallery = document.querySelector(".gallery");
  gallery.innerHTML = "";

  // Affiche les travaux avec leurs images et leurs titres
  works.forEach((work) => {
    const figure = document.createElement("figure");
    const image = document.createElement("img");
    image.src = work.imageUrl;
    image.alt = work.title;
    const figcaption = document.createElement("figcaption");
    figcaption.textContent = work.title;
    figure.appendChild(image);
    figure.appendChild(figcaption);
    gallery.appendChild(figure);
  });
}

// Affiche les catégories dans le filtre et ajoute les événements de filtrage
function displayCategories(categories) {
  const filters = document.getElementById("filters");
  const allBtn = document.createElement("button");
  allBtn.classList.add("active");
  allBtn.classList.add("filter-btn");
  allBtn.textContent = "Tous";
  filters.appendChild(allBtn);
  allBtn.addEventListener("click", function () {
    displayWorks(works);
    activeCategory = null;

    // Met à jour l'état actif des boutons
    document.querySelectorAll(".filter-btn").forEach((btn) => {
      btn.classList.remove("active");
    });
    allBtn.classList.add("active");
  });

  // Crée un bouton pour chaque catégorie et ajoute un événement de clic pour filtrer les travaux
  categories.forEach((category) => {
    const button = document.createElement("button");
    button.classList.add("filter-btn");
    button.textContent = category.name;
    filters.appendChild(button);

    // Événement de clic pour filtrer les travaux par catégorie
    button.addEventListener("click", function () {
      const filteredWorks = works.filter(
        (work) => work.categoryId === category.id,
      );
      displayWorks(filteredWorks);
      activeCategory = category.id;
      // Met à jour l'état actif des boutons
      document.querySelectorAll(".filter-btn").forEach((btn) => {
        btn.classList.remove("active");
      });
      button.classList.add("active");
    });
  });
}

// Affiche les images dans le modal
function displayModalWorks(worksToDisplay) {
  // Vide la galerie du modal avant d'afficher les travaux
  const modalGallery = document.getElementById("modal-gallery");
  modalGallery.innerHTML = "";

  // Affiche les travaux avec leurs images
  worksToDisplay.forEach((work) => {
    const figure = document.createElement("figure");
    const image = document.createElement("img");
    figure.appendChild(image);
    image.src = work.imageUrl;
    modalGallery.appendChild(figure);

    // Bouton de suppression pour chaque image
    const deleteButton = document.createElement("button");
    deleteButton.classList.add("delete-button");
    deleteButton.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
    figure.appendChild(deleteButton);

    // Événement de clic pour supprimer une image
    deleteButton.addEventListener("click", async function () {
      if (!confirm("Voulez-vous vraiment supprimer cette photo ?")) return;
      const ok = await deleteWork(work.id, token);

      // Si la suppression est réussie, retire l'image du modal et de la galerie principale
      if (ok) {
        figure.remove();
        works = works.filter((w) => w.id !== work.id);
        if (activeCategory) {
          displayWorks(works.filter((w) => w.categoryId === activeCategory));
        } else {
          displayWorks(works);
        }
      }
    });
  });
}
init();
