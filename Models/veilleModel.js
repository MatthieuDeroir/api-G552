// Models/veilleModel.js
const db = require("../Database/db");

class Veille {
  constructor() {
    this.createTable();
  }

  createTable() {
    const createTable = `
            CREATE TABLE IF NOT EXISTS veille
            (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                enable BOOLEAN NOT NULL DEFAULT 1,
                start_time INTEGER,
                end_time INTEGER
            )
        `;
    db.run(createTable);
  }

  create(veille) {
    return new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO veille (enable, start_time, end_time)
                 VALUES (?, ?, ?)`,
        [veille.enable, veille.startTime, veille.endTime],
        function (err) {
          if (err) {
            reject(err);
          } else {
            resolve(this.lastID);
          }
        }
      );
    });
  }

  getAll() {
    return new Promise((resolve, reject) => {
      db.all("SELECT * FROM veille", (err, veilles) => {
        if (err) {
          reject(err);
        } else {
          resolve(veilles);
        }
      });
    });
  }

  getById(id) {
    return new Promise((resolve, reject) => {
      db.get("SELECT * FROM veille WHERE id = ?", [id], (err, veille) => {
        if (err) {
          reject(err);
        } else {
          resolve(veille);
        }
      });
    });
  }

  update(veille) {
    console.log(veille);
    return new Promise((resolve, reject) => {
      db.run(
        `UPDATE veille
         SET enable = ?, start_time = ?, end_time = ?
         WHERE id = ?`,
        [veille.enable, veille.start_time, veille.end_time, veille.id],
        (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        }
      );
    });
  }

  delete(id) {
    return new Promise((resolve, reject) => {
      db.run("DELETE FROM veille WHERE id = ?", [id], (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
}

module.exports = Veille;
