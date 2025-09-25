const codeInput = document.getElementById("code");
const connexionUserBtn = document.getElementById("connexionUserBtn");
const usernameInput = document.getElementById("username");
let currentUser = null;

const message = document.getElementById("message");

connexionUserBtn.addEventListener("click", async () => {
  const username = usernameInput.value.trim();
  const code = codeInput.value.trim();
  

  if (!username) {
    message.textContent = "Veuillez entrer au moins un nom d'utilisateur.";
    return;
  }

  if (username && !code) {
    message.textContent = "Veuillez entrer un code, scannez le QR Code.";
    currentUser = { username : usernameInput, role : "" };
    setTimeout(() => window.location.href = "./affQrCode.html", 3000);
  }

  try {
    const res = await fetch("http://localhost:4000/api/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, code })
    });

    currentUser = { username, code };
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
    window.location.href = "./affQrCode.html";
    
  } catch (err) {
    message.textContent = `Erreur réseau : ${err.message}`;
  }
});