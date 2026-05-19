const form = document.querySelector("form");
form.addEventListener("submit", async function (event) {
  event.preventDefault();
  const email = document.querySelector("#email");
  const password = document.querySelector("#password");
  const emailValue = email.value;
  const passwordValue = password.value;
  const reponse = await fetch("http://localhost:5678/api/users/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: emailValue, password: passwordValue }),
  });
  const data = await reponse.json();
  if (reponse.ok) {
    localStorage.setItem("token", data.token);
    window.location.href = "index.html";
  } else {
    alert("Email ou mot de passe incorrect");
  }
});
