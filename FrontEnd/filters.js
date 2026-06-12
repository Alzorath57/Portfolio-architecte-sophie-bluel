import { displayWorks } from "./gallery.js";
import { state } from "./state.js";

// Affiche les catégories dans le filtre et ajoute les événements de filtrage
export function displayCategories(categories) {
  if (localStorage.getItem("token")) {
    return; // Ne pas afficher les filtres si l'utilisateur est connecté
  }
  const filters = document.getElementById("filters");
  const allBtn = document.createElement("button");
  allBtn.classList.add("active");
  allBtn.classList.add("filter-btn");
  allBtn.textContent = "Tous";
  filters.appendChild(allBtn);
  allBtn.addEventListener("click", function () {
    displayWorks(state.works);
    state.activeCategory = null;

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
      const filteredWorks = state.works.filter(
        (work) => work.categoryId === category.id,
      );
      displayWorks(filteredWorks);
      state.activeCategory = category.id;
      // Met à jour l'état actif des boutons
      document.querySelectorAll(".filter-btn").forEach((btn) => {
        btn.classList.remove("active");
      });
      button.classList.add("active");
    });
  });
}
