let currentUser = { "username": "lionknight", "role": "admin" };
const usernameInputApp = document.getElementById("username");
const roleSelectApp = document.getElementById("role");
const addUserBtn = document.getElementById("addUserBtn");
const message = document.getElementById("message");

// Ajouter un utilisateur
addUserBtn.addEventListener("click", async () => {
  if (currentUser.role !== "admin") {
    message.textContent = "Seul un administrateur peut ajouter un utilisateur.";
    return;
  }

  const newUsername = usernameInputApp.value.trim();
  const newRole = roleSelectApp.value;

  if (!newUsername) {
    message.textContent = currentUser.username+"Veuillez entrer un nom d'utilisateur.";
    return;
  }

  try {
    const res = await fetch("http://localhost:4000/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newUsername, role: newRole })
    });
  } catch (err) {
    message.textContent = `Erreur réseau : ${err.message}`;
  }
});

affQrCode.addEventListener("click", () => {
  if (usernameInputApp.value.trim() !== "" && roleSelectApp.value.trim() !== "") {
    currentUser.username = usernameInputApp.value.trim();
    currentUser.role = roleSelectApp.value.trim();
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
  }
  window.location.href = "./affQrCode.html";
});