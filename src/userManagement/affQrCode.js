const generateBtn = document.getElementById("generateBtn");
const qrCodeImg = document.getElementById("qrCode");
const usernameInput = document.getElementById("username");
const message = document.getElementById("message");

generateBtn.addEventListener("click", () => {
    const username = usernameInput.value.trim();
    if (!username) {
        alert("Veuillez entrer un nom d'utilisateur.");
        return;
    }
    qrCodeImg.src = `../../qrcodes/${username}-qrcode.png`;
    qrCodeImg.alt = `QR Code pour ${username}`;
    qrCodeImg.style.display = "block";

    // l'image n'existe pas => on attrape l'erreur
    qrCodeImg.onerror = () => {
        message.textContent = "❌ QR code non trouvé. Assurez-vous que l'utilisateur existe.";
        qrCodeImg.style.display = "none";
    };

});

// Générer le QR code au chargement si un nom d'utilisateur est déjà présent
if (usernameInput.value.trim()) {
    generateBtn.click();
}