const codeInput = document.getElementById("code");
const connexionUserBtn = document.getElementById("connexionUserBtn");
const usernameInput = document.getElementById("username");
let currentUser = "";

const message = document.getElementById("message");

connexionUserBtn.addEventListener("click", async () => {
  const username = usernameInput.value.trim();
  const code = codeInput.value.trim();
  

  if (!username || !code) {
    message.textContent = "Veuillez entrer un nom d'utilisateur et un code.";
    return;
  }

  try {
    const res = await fetch("http://localhost:4000/api/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, code })
    });

    const data = await res.json();

    currentUser = { username, code };
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
    window.location.href = "./affQrCode.html";

    if (data.error) message.textContent = `❌ ${data.error}`;
    else if (data.valid){
      message.textContent = "✅ Connexion réussie !"
    }
    else message.textContent = "❌ Code invalide !";
  } catch (err) {
    message.textContent = `Erreur réseau : ${err.message}`;
  }
});