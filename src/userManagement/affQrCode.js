const qrCodeImg = document.getElementById("qrCode");
const message = document.getElementById("message");
const currentUser = JSON.parse(localStorage.getItem("currentUser"));

document.addEventListener("DOMContentLoaded", () => {
    qrCodeImg.src = `../../qrcodes/${currentUser.username}-qrcode.png`;
    qrCodeImg.alt = `QR Code pour ${currentUser.username}`;
    qrCodeImg.style.display = "block";

    message.textContent = `QR Code pour l'utilisateur connecté : ${currentUser.username}`;

    // gérer l'erreur si l'image n'existe pas
    qrCodeImg.onerror = () => {
        message.textContent = "❌ QR code non trouvé. Assurez-vous que l'utilisateur existe.";
        qrCodeImg.style.display = "none";
    };

    
});