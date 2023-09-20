const Scoring = require("../Models/scoringModel");

class ScoringController {
  constructor() {
    console.log("TEST00");
    this.scoring = new Scoring();
  }

  create(req, res) {
    const {
      team1,
      team2,
      fauteTeam1,
      fauteTeam2,
      setsTeam1,
      setsTeam2,
      nomTeam1,
      nomTeam2,
    } = req.body;
    this.scoring
      .create({
        team1,
        team2,
        fauteTeam1,
        fauteTeam2,
        setsTeam1,
        setsTeam2,
        nomTeam1,
        nomTeam2,
      })
      .then((scoring) => {
        res.status(201).json(scoring);
      })
      .catch((err) => {
        res.status(500).json({ message: err });
      });
  }

  update(req, res) {
    const scoring = new Scoring();
    const userId = req.params.id;
    const score = req.body;

    console.log("score", score);
    console.log("userId", userId);
    scoring
      .update({userId, score })
      .then((scoring) => {
        res.status(200).json(scoring);
      })
      .catch((err) => {
        res.status(500).json({ message: err });
      });
  }
  updateSettings(req, res) {
    const scoring = new Scoring();
    const userId = req.params.id;
    const score = req.body;
    scoring
      .updateSettings(userId, score)
      .then((scoring) => {
        res.status(200).json(scoring);
      })
      .catch((err) => {
        res.status(500).json({ message: err });
      });
  }

  getAll(req, res) {
    const scoring = new Scoring();
    scoring
      .getAll()
      .then((scorings) => {
        res.status(200).json(scorings);
      })
      .catch((err) => {
        res.status(500).json({ message: err });
      });
  }

  getByUserId(req, res) {
    const scoring = new Scoring();
    const userId = req.params.id;

    scoring
      .getByUserId(userId)
      .then((scorings) => {
        res.status(200).json(scorings);
      })
      .catch((err) => {
        res.status(500).json({ message: err });
      });
  }

  delete(req, res) {
    const id = req.params.id;
    this.scoring
      .delete(id)
      .then(() => {
        res.status(204).json({ message: "Scoring deleted successfully" });
      })
      .catch((err) => {
        res.status(500).json({ message: err });
      });
  }
}

module.exports = ScoringController;
