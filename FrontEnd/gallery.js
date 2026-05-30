import { deleteWork } from "./api.js";
import { state } from "./state.js";

// Affiche les travaux dans la galerie avec leurs images et leurs titres
export function displayWorks(works) {
  // Vide la galerie avant d'afficher les travaux
  const gallery = document.querySelector(".gallery");
  gallery.innerHTML = "";

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

// Affiche les images dans le modal
export function displayModalWorks(worksToDisplay) {
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
      const ok = await deleteWork(work.id, state.token);

      // Si la suppression est réussie, retire l'image du modal et de la galerie principale
      if (ok) {
        figure.remove();
        state.works = state.works.filter((w) => w.id !== work.id);
        if (state.activeCategory) {
          displayWorks(
            state.works.filter((w) => w.categoryId === state.activeCategory),
          );
        } else {
          displayWorks(state.works);
        }
      }
    });
  });
}
