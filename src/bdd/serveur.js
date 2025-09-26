import fs from "fs";
import { randomUUID } from "crypto";

const DB_FILE = "./src/bdd/db.json";

const ADMIN_UUID = "uuid-admin";

const initialDB = {
  users: [
    { id: 1, name: "user1", secret: "secret", password: "password" }
  ],
  tasks: [
    { id: 1, name: "tache1", group_id: ADMIN_UUID, completed: false }
  ],
  groups: [
    { uuid: ADMIN_UUID, name: "Admins" }
  ]
};

if (!fs.existsSync(DB_FILE)) {
  console.log("Base de données absente. Création en cours...");
  fs.writeFileSync(DB_FILE, JSON.stringify(initialDB, null, 2));
  console.log("Base de données JSON créée :", DB_FILE);
} else {
  console.log("Base de données déjà existante :", DB_FILE);
}

export function loadDB() {
  return JSON.parse(fs.readFileSync(DB_FILE, "utf-8"));
}

export { DB_FILE };
