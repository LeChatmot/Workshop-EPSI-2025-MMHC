import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

import { addUser } from "./userManager.js";
import { verifyUser } from "./verifyUser.js";

// Correction pour __dirname en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

// Rendre le dossier QrCodes public
app.use("/qrcodes", express.static(path.join(__dirname, "QrCodes")));
app.use("/", express.static(path.join(__dirname, "/")));


// Endpoint pour ajouter un utilisateur
app.post("/api/users", async (req, res) => {
  const { name, role } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Le nom d'utilisateur est requis." });
  }

  try {
    const newUser = await addUser(name, role);
    res.json({ success: true, user: newUser });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post("/api/verify", (req, res) => {
  const { username, code } = req.body;

  if (!username || !code) {
    return res.status(400).json({ error: "Nom d'utilisateur et code requis." });
  }

  try {
    const valid = verifyUser(username, code); // côté serveur
    res.json({ success: true, valid });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
});
