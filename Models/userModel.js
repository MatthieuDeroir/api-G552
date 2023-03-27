const db = require("../Database/db");
const bcrypt = require("bcrypt");
const Macro = require('./macroModel');

class User {
  constructor() {
    this.createTable();
  }

  createTable() {
    const createTable = `
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY,
            username TEXT,
            password TEXT,
            role TEXT
        )
        `;
    db.run(createTable);
  }

  async create(user) {
    try {
      const hash = await bcrypt.hash(user.password, 10);
      let userId;
  
      await new Promise((resolve, reject) => {
        db.run(
          `INSERT INTO users (username, password, role) VALUES (?, ?, ?)`,
          [user.username, hash, user.role],
          function (err) {
            if (err) {
              console.log(err);
              reject(err);
            } else {
              userId = this.lastID;
              resolve();
            }
          }
        );
      });
  
      console.log('newUser', userId);
  
      // Create 10 macros for the new user
      const macroPromises = [];
      for (let i = 1; i <= 10; i++) {
        macroPromises.push(new Macro().create(i, null, userId));
      }
      await Promise.all(macroPromises);
  
      return 
    } catch (err) {
      throw err;
    }
  }
  

  update(user) {
    return new Promise((resolve, reject) => {
      bcrypt.hash(user.password, 10, (err, hash) => {
        if (err) {
          reject(err);
        } else {
          db.run(
            `UPDATE users SET username = ?, password = ?, role = ? WHERE id = ?`,
            [user.username, hash, user.role, user.id],
            (err) => {
              if (err) {
                reject(err);
              } else {
                resolve(this.getById(user.id));
              }
            }
          );
        }
      });
    });
  }

  getByUsername(username) {
    console.log(`Looking up user with username: ${username}`);
    return new Promise((resolve, reject) => {
      db.get(
        `SELECT * FROM users WHERE username = ?`,
        [username],
        (err, user) => {
          if (err) {
            console.log(`Error looking up user with username: ${username}`, err);
            reject(err);
          } else {
              console.log(`Found user with username: ${username}`, user);
            resolve(user);
          }
        }
      );
    });
  }

  getAll() {
    console.log("getAll");
    return new Promise((resolve, reject) => {
      db.all(`SELECT * FROM users`, (err, users) => {
        if (err) {
          reject(err);
        } else {
          resolve(users);
        }
      });
    });
  }

  getById(id) {
    return new Promise((resolve, reject) => {
      db.get(`SELECT * FROM users WHERE id = ?`, [id], (err, user) => {
        if (err) {
          reject(err);
        } else {
          resolve(user);
        }
      });
    });
  }

  delete(id) {
    return new Promise((resolve, reject) => {
      db.run(`DELETE FROM users WHERE id = ?`, [id], (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
}

module.exports = User;
