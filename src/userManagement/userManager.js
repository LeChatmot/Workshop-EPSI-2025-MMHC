import fs from "fs";
import qrcode from "qrcode";
import { authenticator } from "otplib";
import { DB_FILE, loadDB } from "./../bdd/serveur.js";

function saveDB(db) {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}

export async function addUser(name, role = "user") {
  const db = loadDB();

  if (db.users.find(u => u.name === name)) {
    throw new Error(`❌ L'utilisateur "${name}" existe déjà.`);
  }

  const newId = db.users.length > 0 ? db.users[db.users.length - 1].id + 1 : 1;

  // Générer un secret TOTP
  const secret = authenticator.generateSecret();

  const newUser = {
    id: newId,
    name,
    secret,
    role
  };

  db.users.push(newUser);
  saveDB(db);

  // Générer un QR code PNG
  const otpauth = authenticator.keyuri(name, "Workshop - Gestion des utilisateurs", secret);
  await qrcode.toFile(`qrcodes/${name}-qrcode.png`, otpauth);

  console.log("✅ Nouvel utilisateur créé :", newUser);
  console.log(`📱 QR code scannable généré dans qrcodes/${name}-qrcode.png`);

  return newUser;
}
