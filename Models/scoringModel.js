const db = require("../Database/db");

class Scoring {
  constructor() {
    this.createTable();
  }

  createTable() {
    const createTable = `
      CREATE TABLE IF NOT EXISTS scoring
      (
        id INTEGER PRIMARY KEY,
        score_team1 INTEGER DEFAULT 0,
        score_team2 INTEGER DEFAULT 0,
        faute_team1 INTEGER DEFAULT 0,
        faute_team2 INTEGER DEFAULT 0,
        nom_team1 TEXT DEFAULT 'Visiteur',
        nom_team2 TEXT DEFAULT 'Locaux'
      )
    `;
    const insertFirstRow = `
      INSERT OR IGNORE INTO scoring (id, score_team1, score_team2, faute_team1, faute_team2, nom_team1, nom_team2) VALUES (1, 0, 0, 0, 0, 'Visiteur', 'Locaux')
    `;
  
    db.serialize(() => {
      db.run(createTable);
      db.run(insertFirstRow);
    });
  }
  create(score) {
    return new Promise((resolve, reject) => {
      db.run(
        `INSERT OR IGNORE INTO scoring (id, score_team1, score_team2, faute_team1, faute_team2, nom_team1, nom_team2) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [score.id, score.team1, score.team2, score.fauteTeam1, score.fauteTeam2, score.nomTeam1, score.nomTeam2],
        function (err) {
          if (err) {
            reject(err);
          } else {
            if (this.changes === 0) {
              // Aucune ligne n'a été insérée car elle existe déjà
              resolve(null);
            } else {
              // La ligne a été insérée avec succès
              resolve(this.lastID);
            }
          }
        }
      );
    });
  }

  update(score) {
    return new Promise((resolve, reject) => {
      db.run(
        `UPDATE scoring SET score_team1 = ?, score_team2 = ?, faute_team1 = ?, faute_team2 = ?, nom_team1 = ?, nom_team2 = ? WHERE id = ?`,
        [score.team1, score.team2, score.fauteTeam1, score.fauteTeam2, score.nomTeam1, score.nomTeam2, score.id],
        (err) => {
          if (err) {
            reject(err);
          } else {
            resolve(score.id);
          }
        }
      );
    });
  }

  getAll() {
    return new Promise((resolve, reject) => {
      db.all(`SELECT * FROM scoring`, (err, scores) => {
        if (err) {
          reject(err);
        } else {
          resolve(scores);
        }
      });
    });
  }

  getById(id) {
    return new Promise((resolve, reject) => {
      db.get(`SELECT * FROM scoring WHERE id = ?`, [id], (err, score) => {
        if (err) {
          reject(err);
        } else {
          resolve(score);
        }
      });
    });
  }

  delete(id) {
    return new Promise((resolve, reject) => {
      db.run(`DELETE FROM scoring WHERE id = ?`, [id], (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
}

module.exports = Scoring;
