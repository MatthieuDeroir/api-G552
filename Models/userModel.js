const db = require("../Database/db");
const bcrypt = require("bcrypt");
const Macro = require("./macroModel");
const Param = require("./paramModel");
const Veille = require("./veilleModel");
const Scoring = require("./scoringModel");

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
            role TEXT,
            firstLogin INTEGER,
            active_token TEXT
        )
        `;
    db.run(createTable);
  }

  async create(user) {
    console.log("user", user);
    try {
      
      const hash = await bcrypt.hash(user.password, 10);
      let userId;

      await new Promise((resolve, reject) => {
        db.run(
          `INSERT INTO users (username, password, role, firstLogin) VALUES (?, ?, ?, ?)`,
          [user.username, hash, user.role, 1],
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

      const scoreInitial = {
        team1: 0,
        team2: 0,
        fauteTeam1: 0,
        fauteTeam2: 0,
        nomTeam1: 'Visiteur',
        nomTeam2: 'Locaux'
      };
      if (user.username === "badminton") {
        scoreInitial.option1 = 3;
        scoreInitial.option2 = 21;
        scoreInitial.option3 = 30;
        scoreInitial.option4 = 0;
        scoreInitial.option5 = 0;
        scoreInitial.option7 = 'Visiteur';
      }
      if (user.username === "basketball") {
        scoreInitial.option1 = 0;
        scoreInitial.option2 = 0;
        scoreInitial.option3 = 0;
        scoreInitial.option4 = 0;
        scoreInitial.option7 = 'Visiteur';
      }

      if (user.username === "volleyball") {
        scoreInitial.option1 = 5;
        scoreInitial.option2 = 25;
        scoreInitial.option3 = 15;
        scoreInitial.option4 = 0;
        scoreInitial.option5 = 0;
        scoreInitial.option7 = 'Visiteur';
      }
      if (user.username === "futsal") {
        scoreInitial.option1 = 0;
        scoreInitial.option2 = 0;
      }
      if (user.username === "handball") {
        scoreInitial.option1 = 0;
        scoreInitial.option2 = 0;
      }
      
      const scoring = new Scoring();
      await scoring.create(scoreInitial, userId);

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
