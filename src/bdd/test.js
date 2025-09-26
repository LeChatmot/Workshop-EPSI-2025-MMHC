import { loadDB, DB_FILE } from "./serveur.js"; // adapte le chemin si besoin

try {
  const db = loadDB(); // charge le JSON
  console.log("✅ Base de données chargée !");
  console.log(db); // affiche les données
  console.log("Fichier utilisé :", DB_FILE);
} catch (err) {
  console.error("❌ Erreur lors de la lecture du JSON :", err.message);
}
