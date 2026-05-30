// initialisation de work et activeCategory pour les rendre accessibles dans tout le script

export const state = {
  works: [],

  // Stockage du token pour les appels API nécessitant une authentification
  token: localStorage.getItem("token"),

  // Variable pour suivre la catégorie active
  activeCategory: null,
};
