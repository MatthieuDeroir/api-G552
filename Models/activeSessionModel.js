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
    db.run(createTable);
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

  updateOne (session) {
    console.log("updateOne", session);
    return new Promise((resolve, reject) => {
        db.run(
            `UPDATE activeSessions SET activeToken = ?, last_activity = ? WHERE id = 0`,    
            [session.activeToken, session.last_activity ],
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
