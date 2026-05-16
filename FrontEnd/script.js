// Récupère les travaux depuis l'API

async function getWorks() {
  const response = await fetch("http://localhost:5678/api/works");
  const works = await response.json();
  return works;
}

// ========== INITIALISATION ==========

async function init() {
  const works = await getWorks();
  displayWorks(works);
  const categories = await getCategories();
  displayCategories(categories);
}

// Affiche les travaux dans la galerie

function displayWorks(works) {
  const gallery = document.querySelector(".gallery");
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

// Récupère les catégories depuis l'API

async function getCategories() {
  const response = await fetch("http://localhost:5678/api/categories");
  const categories = await response.json();
  return categories;
}

// Affiche les catégories dans le filtre

function displayCategories(categories) {
  const filters = document.getElementById("filters");
  const allBouton = document.createElement("button");
  allBouton.textContent = "Tous";
  filters.appendChild(allBouton);
}
init();
