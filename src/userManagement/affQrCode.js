const qrCodeImg = document.getElementById("qrCode");
const message = document.getElementById("message");
const currentUser = JSON.parse(localStorage.getItem("currentUser"));

document.addEventListener("DOMContentLoaded", () => {
    qrCodeImg.src = `../../qrcodes/${currentUser.username}-qrcode.png`;
    alert("Image QR code générée !");
    qrCodeImg.alt = `QR Code pour ${userToUse}`;
    qrCodeImg.style.display = "block";

    // gérer l'erreur si l'image n'existe pas
    qrCodeImg.onerror = () => {
        message.textContent = "❌ QR code non trouvé. Assurez-vous que l'utilisateur existe.";
        qrCodeImg.style.display = "none";
    };
});

// Générer le QR code au chargement si currentUser existe et input vide
if (currentUser && !usernameInput.value.trim()) {
    generateBtn.click();
}