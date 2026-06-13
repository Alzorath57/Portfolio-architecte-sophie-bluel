import { displayModalWorks } from "./gallery.js";
import { state } from "./state.js";

export function setupModal(editButton) {
  // Création du modal
  const modal = document.createElement("div");
  modal.id = "modal";
  document.body.appendChild(modal);
  editButton.addEventListener("click", function () {
    modal.style.display = "flex";
    displayModalWorks(state.works);
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
    document.getElementById("title-form").value = "";
    document.getElementById("category-form").value = "";
    document.getElementById("image-form").value = "";
    const existingImage = document.getElementById("file-image");
    if (existingImage) existingImage.remove();
    const submitButton = document.getElementById("submit-button");
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.style.backgroundColor = "#A7A7A7";
    }
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

  return {
    modal,
    modalContent,
    modalTitle,
    modalGallery,
    addButton,
    separator,
    modalAdd,
    separatorForm,
    form,
  };
}
