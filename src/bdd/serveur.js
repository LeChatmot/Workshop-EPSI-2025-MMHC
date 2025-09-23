import express from "express";
import fs from "fs";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

const DB_FILE = "./db.json";

// Fonction utilitaire pour lire/écrire
function readDB() {
  return JSON.parse(fs.readFileSync(DB_FILE, "utf-8"));
}
function writeDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// --- Utilisateurs ---
app.get("/users", (req, res) => {
  const db = readDB();
  res.json(db.users);
});

app.post("/users", (req, res) => {
  const db = readDB();
  const newUser = { id: Date.now(), name: req.body.name };
  db.users.push(newUser);
  writeDB(db);
  res.json(newUser);
});

// --- Groupes ---
app.get("/groups", (req, res) => {
  const db = readDB();
  res.json(db.groups);
});

app.post("/groups", (req, res) => {
  const db = readDB();
  const newGroup = { id: Date.now(), name: req.body.name };
  db.groups.push(newGroup);
  writeDB(db);
  res.json(newGroup);
});

// Associer user à un groupe
app.post("/user-groups", (req, res) => {
  const db = readDB();
  db.user_groups.push({ user_id: req.body.user_id, group_id: req.body.group_id });
  writeDB(db);
  res.json({ message: "Utilisateur ajouté au groupe !" });
});

// --- Tâches ---
app.get("/tasks", (req, res) => {
  const db = readDB();
  res.json(db.tasks);
});

app.post("/tasks", (req, res) => {
  const db = readDB();
  const newTask = { id: Date.now(), title: req.body.title, completed: false, user_id: req.body.user_id };
  db.tasks.push(newTask);
  writeDB(db);
  res.json(newTask);
});

app.put("/tasks/:id", (req, res) => {
  const db = readDB();
  const task = db.tasks.find(t => t.id == req.params.id);
  if (task) {
    task.completed = req.body.completed;
    writeDB(db);
    res.json(task);
  } else {
    res.status(404).json({ error: "Tâche non trouvée" });
  }
});

// --- Serveur ---
app.listen(4000, () => {
  console.log("🚀 Backend JSON lancé sur http://localhost:4000");
});
