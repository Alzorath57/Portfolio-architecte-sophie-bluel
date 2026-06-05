import { state } from "./state.js";

// Récupère les travaux depuis l'API
export async function getWorks() {
  const response = await fetch(`${state.apiUrl}/works`);
  const works = await response.json();
  return works;
}

// Récupère les catégories depuis l'API
export async function getCategories() {
  const response = await fetch(`${state.apiUrl}/categories`);
  const categories = await response.json();
  return categories;
}

// Supprime un travail via l'API
export async function deleteWork(workId) {
  const response = await fetch(`${state.apiUrl}/works/${workId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${state.token}`,
    },
  });
  return response.ok;
}

// Ajoute un travail via l'API
export async function addWork(workData) {
  const response = await fetch(`${state.apiUrl}/works`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${state.token}`,
    },
    body: workData,
  });
  if (response.ok) {
    return await response.json();
  }
  return null;
}

// Connecte l'utilisateur via l'API
export async function loginUser(email, password) {
  const response = await fetch(`${state.apiUrl}/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (response.ok) {
    return await response.json();
  }
  return null;
}
