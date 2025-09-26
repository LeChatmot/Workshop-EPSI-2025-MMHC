import { loadDB } from "./../bdd/serveur.js";
import { authenticator } from "otplib";

export function verifyUser(name, token) {
  const db = loadDB();
  const user = db.users.find(u => u.name === name);

  if (!user) {
    throw new Error("❌ Utilisateur introuvable.");
  }

  // Vérifie le code TOTP avec le secret stocké
  const isValid = authenticator.check(token, user.secret);
  return isValid;
}