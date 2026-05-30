export function setupAuth() {
  // Modifie le lien de connexion en déconnexion
  const loginLink = document.getElementById("login-link");
  loginLink.textContent = "logout";
  loginLink.addEventListener("click", function () {
    localStorage.removeItem("token");
    window.location.href = "login.html";
  });
}
