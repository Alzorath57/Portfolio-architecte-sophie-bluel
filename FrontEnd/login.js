import { loginUser } from "./api.js";

const form = document.querySelector("form");
form.addEventListener("submit", async function (event) {
  event.preventDefault();
  const emailValue = document.querySelector("#email").value;
  const passwordValue = document.querySelector("#password").value;

  const data = await loginUser(emailValue, passwordValue);
  if (data) {
    localStorage.setItem("token", data.token);
    window.location.href = "index.html";
  } else {
    alert("Email ou mot de passe incorrect");
  }
});
