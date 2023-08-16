const db = require("../../Database/db");

class BadmintonModels {
  constructor() {
    this.createTable();
  }

  createTable() {
    const createTable = `
    CREATE TABLE IF NOT EXISTS badminton_score
    (
        id INTEGER PRIMARY KEY,
        player1_name TEXT,
        player2_name TEXT,
        score_player1 INTEGER,
        score_player2 INTEGER,
        sets_won_player1 INTEGER,
        sets_won_player2 INTEGER,
        server_name TEXT,
        timer INTEGER,
        set_type INTEGER,
        tie_break INTEGER,
        number_of_sets INTEGER,
        points_per_set INTEGER
    )
  `;
    db.run(createTable, [], (err) => {
      if (err) {
        console.log(err);
      } else {
        this.initializeFirstScore({
          player1: "Visiteur",
          player2: "Locaux",
          scorePlayer1: 0,
          scorePlayer2: 0,
          setsWonPlayer1: 0,
          setsWonPlayer2: 0,
          server: "Visiteur",
          timer: 0,
          setType: 7,
          tieBreak: 0,
          numberOfSets: 3,
          pointsPerSet: 21,
        });
      }
    });
  }

  initializeFirstScore(score) {
    return new Promise((resolve, reject) => {
      db.get("SELECT * FROM badminton_score", [], (err, rows) => {
        if (err) {
          reject(err);
        } else if (!rows || rows.length === 0) {
          this.create(score).then(resolve).catch(reject);
        } else {
          resolve();
        }
      });
    });
  }

  create(score) {
    return new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO badminton_score (player1_name, player2_name, score_player1, score_player2, sets_won_player1, sets_won_player2, server_name, timer, set_type, tie_break, number_of_sets, points_per_set)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          score.player1,
          score.player2,
          score.scorePlayer1,
          score.scorePlayer2,
          score.setsWonPlayer1,
          score.setsWonPlayer2,
          score.server,
          score.timer,
          score.setType,
          score.tieBreak,
          score.numberOfSets,
          score.pointsPerSet,
        ],
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
      db.all("SELECT * FROM badminton_score", [], (err, scores) => {
        if (err) {
          reject(err);
        } else {
          resolve(scores);
        }
      });
    });
  }

  getScoreById(id) {
    return new Promise((resolve, reject) => {
      db.get("SELECT * FROM badminton_score WHERE id = ?", [id], (err, score) => {
        if (err) {
          reject(err);
        } else {
          resolve(score);
        }
      });
    });
  }

  updateScoreById(id, score) {
    return new Promise((resolve, reject) => {
      db.run(
        `UPDATE badminton_score
         SET score_player1 = ?, score_player2 = ?, sets_won_player1 = ?, sets_won_player2 = ?, server_name = ?, timer = ?, set_type = ?, tie_break = ?, number_of_sets = ?, points_per_set = ?
         WHERE id = ?`,
        [
          score.scorePlayer1,
          score.scorePlayer2,
          score.setsWonPlayer1,
          score.setsWonPlayer2,
          score.server,
          score.timer,
          score.setType,
          score.tieBreak,
          score.numberOfSets,
          score.pointsPerSet,
          id,
        ],
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

  deleteScoreById(id) {
    return new Promise((resolve, reject) => {
      db.run("DELETE FROM badminton_score WHERE id = ?", [id], (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
}

module.exports = BadmintonModels;
