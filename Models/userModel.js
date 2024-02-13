const db = require("../Database/db");
const bcrypt = require("bcrypt");
const Macro = require("./macroModel");
const Param = require("./paramModel");
const Veille = require("./veilleModel");
const fs = require("fs");

class User {
  constructor() {
    if (User.instance) {
      throw new Error("Vous ne pouvez créer qu'une instance de User.");
    }
    User.instance = this;
  }

  static getInstance() {
    console.log("getInstance");
    if (!User.instance) {
      User.instance = new User();
    }
    return User.instance;
  }

  createTable() {
    const createTable = `
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY,
            username TEXT,
            password TEXT,
            role TEXT,
            firstLogin INTEGER,
            active_token TEXT,
            language TEXT DEFAULT 'fr'
        )
        `;
    db.run(createTable, (err) => {
      if (err) {
        console.error("Error creating activeSessions table:", err.message);
      } else {
        this.initializeTableIfEmpty();
      }
    });
  }

  async initializeTableIfEmpty() {
    const checkTableEmptySql = `SELECT COUNT(id) AS count FROM users`;

    db.get(checkTableEmptySql, (err, row) => {
      console.log("row", row.count);
      if (err) {
        console.error("Error checking activeSessions table:", err.message);
      } else if (row.count === 0) {
        // La table est vide, insérez une ligne initiale
        const sports = [
          "Basketball",
          "Handball",
          "Volleyball",
          "Tennis",
          "Tennis de table",
          "Badminton",
          "Rink hockey",
          "Futsal",
          "Boxe",
          "Roller hockey",
          "Hockey sur glace",
          "Floorball",
          "Chronométré",
          "Sport libre",
          "Netball",
        ];
        sports.forEach((sport) => {
          const user = {
            username: sport,
            password: sport,
            role: "user",
            language: "fr",
          };
          const folderName = `${process.env.UPLOAD_PATH}${user.username}`;
          if (!fs.existsSync(folderName)) {
            console.log("Folder does not exist");
            fs.mkdirSync(folderName);
            console.log("Folder created");
          }

          this.create(user);
        });
      } else {
        console.log("Table users already initialized");
      }
    });
  }

  async create(user) {
    console.log("user", user);
    try {
      const hash = await bcrypt.hash(user.password, 10);
      let userId;

      // Insérer la langue dans la base de données
      await new Promise((resolve, reject) => {
        db.run(
          `INSERT INTO users (username, password, role, firstLogin, language) VALUES (?, ?, ?, ?, ?)`,
          [user.username, hash, user.role, 1, user.language], // Ajout de user.language ici
          function (err) {
            if (err) {
              reject(err);
            } else {
              userId = this.lastID;
              resolve();
            }
          }
        );
      });

      console.log("newUser", userId);

      // Create 10 macros for the new user
      const macroPromises = [];
      for (let i = 0; i <= 15; i++) {
        macroPromises.push(new Macro().create(i, null, userId));
      }
      await Promise.all(macroPromises);

      (async () => {
        const veille = new Veille();
        const veilleId = await veille.create({
          enable: false,
          startTime: "1",
          endTime: "24",
        });

        const param = new Param();
        await param.create({
          userId: userId,
          veilleId: veilleId,
          eventAuto: true,
        });
      })();

      return;
    } catch (err) {
      throw err;
    }
  }

  changePassword(user) {
    console.log("changePassword", user);
    return new Promise((resolve, reject) => {
      bcrypt.hash(user.newPassword, 10, (err, hash) => {
        if (err) {
          reject(err);
        } else {
          db.run(
            `UPDATE users SET password = ? WHERE id = ?`,
            [hash, user.id],
            (err) => {
              if (err) {
                console.log(err);
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

  updateLanguage(language, id) {
    return new Promise((resolve, reject) => {
      db.run(
        `UPDATE users SET language = ? WHERE id = ?`,
        [language.language, id],
        (err) => {
          if (err) {
            console.log(err);
            reject(err);
          } else {
          }
        }
      );
    });
  }

  updateFirstLogin(userId) {
    console.log("updateFirstLogin", userId);
    return new Promise((resolve, reject) => {
      db.run(
        `UPDATE users SET firstLogin = 0 WHERE id = ?`,
        [userId],
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
  updateTokenAndActivity(user) {
    return new Promise((resolve, reject) => {
      db.run(
        `UPDATE users SET active_token = ? WHERE id = ?`,
        [user.active_token, user.id],
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
    return new Promise((resolve, reject) => {
      db.get(
        `SELECT * FROM users WHERE username = ?`,
        [username],
        (err, user) => {
          console.log(err, user);
          if (err) {
            console.log(
              `Error looking up user with username: ${username}`,
              err
            );
            reject(err);
          } else {
            resolve(user);
          }
        }
      );
    });
  }

  getAll() {
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
