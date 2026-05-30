import { deleteWork, getCategories, getWorks, addWork } from "./api.js";
import { displayWorks, displayModalWorks } from "./gallery.js";
import { state } from "./state.js";
import { displayCategories } from "./filters.js";
import { setupAuth } from "./auth.js";
import { setupModal } from "./modal.js";
import { setupForm } from "./form.js";

// ========== INITIALISATION ==========
async function init() {
  state.works = await getWorks();
  displayWorks(state.works);
  const categories = await getCategories();
  displayCategories(categories);
  if (state.token) {
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

    setupForm(
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
    );
  }
}

init();
