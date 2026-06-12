import { addWork } from "./api.js";
import { displayWorks } from "./gallery.js";
import { state } from "./state.js";

export function setupForm(
  form,
  modal,
  modalAdd,
  modalGallery,
  addButton,
  separator,
  modalTitle,
  separatorForm,
  categories,
  editButton,
  modalContent,
) {
  // Input pour l'image
  const imageInput = document.createElement("input");
  const imageLabel = document.createElement("label");
  const imagePreview = document.createElement("div");

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
    updateSubmitButton();
  });

  // Input pour le titre
  const titleInput = document.createElement("input");
  const titleLabel = document.createElement("label");

  // Validation du titre
  titleLabel.textContent = "Titre";
  titleLabel.htmlFor = "title-form";
  titleInput.type = "text";
  titleInput.id = "title-form";
  titleInput.name = "title";
  titleInput.addEventListener("input", function () {
    updateSubmitButton();
  });

  // Input pour la catégorie
  const categoryselect = document.createElement("select");
  const categoryLabel = document.createElement("label");

  // Validation de la catégorie
  categoryLabel.textContent = "Catégorie";
  categoryLabel.htmlFor = "category-form";
  categoryselect.id = "category-form";
  categoryselect.name = "category";
  categoryselect.addEventListener("change", function () {
    updateSubmitButton();
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

  // Désactive le bouton de soumission tant que les champs ne sont pas valides
  function updateSubmitButton() {
    if (
      imageInput.files[0] &&
      titleInput.value.trim().length >= 2 &&
      categoryselect.value
    ) {
      submitButton.disabled = false;
      submitButton.style.backgroundColor = "#1D6154";
    } else {
      submitButton.disabled = true;
      submitButton.style.backgroundColor = "#A7A7A7";
    }
  }
  updateSubmitButton();

  // Événement de soumission du formulaire
  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const formData = new FormData();
    formData.append("image", imageInput.files[0]);
    formData.append("title", titleInput.value);
    formData.append("category", parseInt(categoryselect.value));

    // Appelle la fonction d'ajout de travail et met à jour la galerie si l'ajout est réussi
    const newWork = await addWork(formData);
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
  form.appendChild(titleLabel);
  form.appendChild(titleInput);
  form.appendChild(categoryLabel);
  form.appendChild(categoryselect);
  form.appendChild(separatorForm);
  form.appendChild(submitButton);
}
