let works = [];
// Lis le token dans le local storage
const token = localStorage.getItem("token");

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
  if (token) {
    const loginLink = document.getElementById("login-link");
    loginLink.textContent = "logout";
    loginLink.addEventListener("click", function () {
      localStorage.removeItem("token");
      window.location.href = "login.html";
    });
    const editBanner = document.createElement("div");
    editBanner.id = "edit-banner";
    editBanner.innerHTML =
      '<i class="fa-regular fa-pen-to-square"></i> Mode édition';
    document.body.prepend(editBanner);
  }
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
  allBtn.classList.add("active");
  allBtn.classList.add("filter-btn");
  allBtn.textContent = "Tous";
  filters.appendChild(allBtn);
  allBtn.addEventListener("click", function () {
    document.querySelector(".gallery").innerHTML = "";
    displayWorks(works);
    document.querySelectorAll(".filter-btn").forEach((btn) => {
      btn.classList.remove("active");
    });
    allBtn.classList.add("active");
  });

  categories.forEach((category) => {
    const button = document.createElement("button");
    button.classList.add("filter-btn");
    button.textContent = category.name;
    filters.appendChild(button);

    button.addEventListener("click", function () {
      document.querySelector(".gallery").innerHTML = "";
      const filteredWorks = works.filter(
        (work) => work.categoryId === category.id,
      );
      displayWorks(filteredWorks);
      document.querySelectorAll(".filter-btn").forEach((btn) => {
        btn.classList.remove("active");
      });
      button.classList.add("active");
    });
  });
}
init();
