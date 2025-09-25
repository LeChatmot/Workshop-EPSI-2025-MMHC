const currentUser = { username: "lionknight", role: "admin" };

const usernameInputApp = document.getElementById("username");

const roleSelectApp = document.getElementById("role");
const addUserBtn = document.getElementById("addUserBtn");

const message = document.getElementById("message");
const affQrCode = document.getElementById("affQrCode");

affQrCode.addEventListener("click", () => {
  window.location.href = "./affQrCode.html";
});

// Ajouter un utilisateur
addUserBtn.addEventListener("click", async () => {
  if (currentUser.role !== "admin") {
    message.textContent = "Seul un administrateur peut ajouter un utilisateur.";
    return;
  }

  const newUsername = usernameInputApp.value.trim();
  const newRole = roleSelectApp.value;

  if (!newUsername) {
    message.textContent = "Veuillez entrer un nom d'utilisateur.";
    return;
  }

  try {
    const res = await fetch("http://localhost:4000/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newUsername, role: newRole })
    });

    alert(`✅ Utilisateur "${newUsername}" ajouté avec succès !`);
    window.location.href = "./affQrCode.html";

    // if (res.status === 200) {
    //   alert(`✅ Utilisateur "${newUsername}" ajouté avec succès !`);
    //   usernameInput.value = "";
    //   roleSelect.value = "user";
    // };
    // const data = await res.json();

    // if (data.error) {
    //   message.textContent = `❌ ${data.error}`;


    // } else {
    //   message.textContent = `✅ Utilisateur "${data.user.name}" ajouté avec succès !`;
    //   usernameInput.value = "";
    //   roleSelect.value = "user";


    // }
  } catch (err) {
    message.textContent = `Erreur réseau : ${err.message}`;
  }
});