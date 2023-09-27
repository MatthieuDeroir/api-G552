const db = require("../Database/db");

class ActiveSession {
  constructor() {
    this.createTable();
  }

  createTable() {
    const createTable = `
    CREATE TABLE IF NOT EXISTS activeSessions (
            id INTEGER PRIMARY KEY,
            userId INTEGER,
            activeToken TEXT,
            last_activity INTEGER
        )
        `;
    db.run(createTable, (err) => {
      if (err) {
        console.error(err);
      } else {
        // Vérifier si la table est vide
        db.get(`SELECT COUNT(*) as count FROM activeSessions`, (err, row) => {
          if (err) {
            console.error(err);
          } else {
            // Si la table est vide, insérez la première ligne
            if (row.count === 0) {
              const firstRow = {
                userId: null, // Utilisez les valeurs appropriées pour votre application
                active_token: null,
                last_activity: null,
              };

              db.run(
                `INSERT INTO activeSessions (userId, activeToken, last_activity) VALUES (?, ?, ?)`,
                [firstRow.userId, firstRow.activeToken, firstRow.last_activity],
                (err) => {
                  if (err) {
                    console.error(err);
                  } else {
                    console.log("Première ligne insérée avec succès !");
                  }
                }
              );
            }
          }
        });
      }
    });
  }

  async create(session) {
    console.log("session", session);
    return new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO activeSessions (userId, activeToken, last_activity) VALUES (?, ?, ?)`,
        [session.userId, session.activeToken, session.last_activity],
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
  logout() {
    console.log("logout");
    return new Promise((resolve, reject) => {
      db.run(
        `UPDATE activeSessions SET userId = ? ,activeToken = ?, last_activity = ? WHERE id = 1`,
        [null,null, null],
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
  getAll() {
    return new Promise((resolve, reject) => {
      db.all(`SELECT * FROM activeSessions`, (err, sessions) => {
        if (err) {
          reject(err);
        } else {
          resolve(sessions);
        }
      });
    });
  }

  getFirst() {
    return new Promise((resolve, reject) => {
      db.get(`SELECT * FROM activeSessions ORDER BY id ASC LIMIT 1`, (err, session) => {
        if (err) {
          reject(err);
        } else {
          resolve(session);
        }
      });
    });
  }
  

  getByUserId(userId) {
    console.log("getByUserId", userId);
    return new Promise((resolve, reject) => {
      db.get(
        `SELECT * FROM activeSessions WHERE userId = ? ORDER BY last_activity DESC`,
        [userId],
        (err, session) => {
          if (err) {
            reject(err);
          } else {
            resolve(session);
          }
        }
      );
    });
  }

  updateOne(session) {
    return new Promise((resolve, reject) => {
      db.run(
        `UPDATE activeSessions SET userId = ?, activeToken = ?, last_activity = ? WHERE id = 1`,
        [session.userId, session.active_token, session.last_activity],
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
      db.run(`DELETE FROM activeSessions WHERE id = ?`, [id], (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
}

module.exports = ActiveSession;
