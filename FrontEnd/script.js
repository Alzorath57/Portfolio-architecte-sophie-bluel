let works = [];
// Récupère les travaux depuis l'API

async function getWorks() {
  const response = await fetch("http://localhost:5678/api/works");
  works = await response.json();
  return works;
}

// ========== INITIALISATION ==========

async function init() {
  works = await getWorks();
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
  const allBtn = document.createElement("button");
  allBtn.textContent = "Tous";
  filters.appendChild(allBtn);
  allBtn.addEventListener("click", function () {
    document.querySelector(".gallery").innerHTML = "";
    displayWorks(works);
  });

  categories.forEach((categorie) => {
    const button = document.createElement("button");
    button.textContent = categorie.name;
    filters.appendChild(button);

    button.addEventListener("click", function () {
      document.querySelector(".gallery").innerHTML = "";
      const filteredWorks = works.filter(
        (work) => work.categoryId === categorie.id,
      );
      displayWorks(filteredWorks);
    });
  });
}
init();
