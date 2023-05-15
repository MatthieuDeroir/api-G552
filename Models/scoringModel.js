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
        score_team1 INTEGER,
        score_team2 INTEGER,
        user_id INTEGER,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `;
    db.run(createTable);
  }

  create(score) {
    return new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO scoring (score_team1, score_team2, user_id) VALUES (?, ?, ?)`,
        [score.team1, score.team2, score.userId],
        (err) => {
          if (err) {
            reject(err);
          } else {
            resolve(this.getById(this.lastID));
          }
        }
      );
    });
  }

  update(score) {
    console.log("score", score.id, score.team1, score.team2);
    return new Promise((resolve, reject) => {
      db.run(
        `UPDATE scoring SET score_team1 = ?, score_team2 = ? WHERE user_id = ?`,
        [score.team1, score.team2, score.id],
        (err) => {
          if (err) {
            console.log(err);
            reject(err);
          } else {
            resolve(this.getById(score.id));
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

  getByUserId(id) {
    return new Promise((resolve, reject) => {
      db.all(`SELECT * FROM scoring WHERE user_id = ?`, [id], (err, scores) => {
        if (err) {
          reject(err);
        } else {
          resolve(scores);
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
