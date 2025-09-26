import fs from "fs";

const DB_FILE = "./src/bdd/bd.json";

function loadDB() {
  return JSON.parse(fs.readFileSync(DB_FILE, "utf-8"));
}

function saveDB(db: any) {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}

export class AjoutService {
  ajouterUser = (name: string, secret: string) => {
    const db = loadDB();
    const newId = db.users.length > 0 ? db.users[db.users.length - 1].id + 1 : 1;

    const newUser = { id: newId, name, secret };
    db.users.push(newUser);

    saveDB(db);
    console.log("User ajouté :", newUser);
  };

  ajouterGroupe = (uuid: string, name: string) => {
    const db = loadDB();
    const newGroup = { uuid, name };
    db.groups.push(newGroup);

    saveDB(db);
    console.log("Groupe ajouté :", newGroup);
  };

  ajouterTache = (name: string, userId: number, groupUuid: string) => {
    const db = loadDB();

    const group = db.groups.find((g: any) => g.uuid === groupUuid);
    if (!group) {
      console.error("Groupe introuvable :", groupUuid);
      return;
    }

    const user = db.users.find((u: any) => u.id === userId);
    if (!user) {
      console.error("User introuvable :", userId);
      return;
    }

    const newId = db.tasks.length > 0 ? db.tasks[db.tasks.length - 1].id + 1 : 1;

    const newTask = {
      id: newId,
      name,
      group_id: groupUuid,
      user_id: userId,
      completed: false,
    };

    db.tasks.push(newTask);

    saveDB(db);
    console.log("✅ Tâche ajoutée :", newTask);
  };
}
