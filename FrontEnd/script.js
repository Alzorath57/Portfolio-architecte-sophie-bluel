import { deleteWork, getCategories, getWorks, addWork } from "./api.js";
import { displayWorks, displayModalWorks } from "./gallery.js";
import { state } from "./state.js";
import { displayCategories } from "./filters.js";
import { setupAuth } from "./auth.js";
import { setupModal } from "./modal.js";

// Lis le token dans le local storage
const token = localStorage.getItem("token");

// ========== INITIALISATION ==========
async function init() {
  state.works = await getWorks();
  displayWorks(state.works);
  const categories = await getCategories();
  displayCategories(categories);
  if (token) {
    setupAuth();
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
    const {
      modal,
      modalContent,
      modalTitle,
      modalGallery,
      addButton,
      separator,
      modalAdd,
      separatorForm,
      form,
    } = setupModal(editButton);

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
        state.works.push(newWork);
        titleInput.value = "";
        categoryselect.value = "";
        if (state.activeCategory) {
          displayWorks(
            state.works.filter((w) => w.categoryId === state.activeCategory),
          );
        } else {
          displayWorks(state.works);
        }
        modalAdd.style.display = "none";
        modal.style.display = "none";
      }
    });

    // Événement pour revenir à la galerie depuis le formulaire d'ajout
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

init();
