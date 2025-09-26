import readline from "readline";
import { verifyUser } from "./verifyUser.js"; // ta fonction qui vérifie le code TOTP

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

/*input*/ rl.question("Entrez le code à 6 chiffres de Google Authenticator : ", (code) => {
  const username = "lionknight"; // utilisateur à vérifier

  try {
    const valid = verifyUser(username, code);
    console.log(valid ? "✅ Connexion réussie !" : "❌ Code invalide !");
  } catch (err) {
    console.error(err.message);
  }

  rl.close();
});