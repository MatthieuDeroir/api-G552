const db = require("../Database/db");

class RefreshToken {
    constructor() {
      this.createTable();
    }
  
    createTable() {
      const createTable = `
        CREATE TABLE IF NOT EXISTS refresh_tokens
        (
          id INTEGER PRIMARY KEY,
          token TEXT NOT NULL,
          user_id INTEGER NOT NULL,
          last_activity TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
      `;
      db.run(createTable);
    }

  create(refreshToken) {
    return new Promise((resolve, reject) => {
      const { token, user,lastActivity } = refreshToken;
      console.log(refreshToken);
      const sqlQuery = `
        INSERT INTO refresh_tokens (token, user_id, last_activity)
        VALUES (?, ?, ?)
      `;
      db.run(sqlQuery, [token, user,lastActivity], (err) => {
        if (err) {
          reject(err);
        } else {
          resolve({ token, user });
        }
      });
    });
  }
  deleteByUserId(userId) {
    return new Promise((resolve, reject) => {
      const sqlQuery = `
        DELETE FROM refresh_tokens WHERE user_id = ?
      `;
      db.run(sqlQuery, [userId], (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  getByToken(token) {
    return new Promise((resolve, reject) => {
      const sqlQuery = `
        SELECT * FROM refresh_tokens WHERE token = ?
      `;
      db.get(sqlQuery, [token], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }
  deleteAll() {
    return new Promise((resolve, reject) => {
      const sqlQuery = `
        DELETE FROM refresh_tokens
      `;
      db.run(sqlQuery, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  getByUserId(userId) {
    return new Promise((resolve, reject) => {
      const sqlQuery = `
        SELECT * FROM refresh_tokens WHERE user_id = ?
      `;
      db.get(sqlQuery, [userId], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }
  getLastActivity(userId) {
    return new Promise((resolve, reject) => {
      const sqlQuery = `
        SELECT last_activity FROM refresh_tokens WHERE user_id = ?
      `;
      db.get(sqlQuery, [userId], (err, row) => {
        if (err) {
          reject(err);
        } else {
          if (row) {
            resolve(row.last_activity);
          } else {
            resolve(null);
          }
        }
      });
    });
  }
  updateLastActivity(userId, lastActivity) {
    return new Promise((resolve, reject) => {
      const sqlQuery = `
        UPDATE refresh_tokens
        SET last_activity = ?
        WHERE user_id = ?
      `;
      db.run(sqlQuery, [lastActivity, userId], (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
  getByUserId(userId) {
    return new Promise((resolve, reject) => {
      const sqlQuery = `
        SELECT * FROM refresh_tokens WHERE user_id = ?
      `;
      db.get(sqlQuery, [userId], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }
}

module.exports = RefreshToken;
