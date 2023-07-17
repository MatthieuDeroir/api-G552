const Scoring = require("../Models/scoringModel");

class ScoringController {
  constructor() {
    this.scoring = new Scoring();
  }

  create(req, res) {
    const { team1, team2, fauteTeam1, fauteTeam2, nomTeam1, nomTeam2 } = req.body;
    this.scoring
      .create({ team1, team2, fauteTeam1, fauteTeam2, nomTeam1, nomTeam2 })
      .then((scoring) => {
        res.status(201).json(scoring);
      })
      .catch((err) => {
        res.status(500).json({ message: err });
      });
  }

  update(req, res) {
    const scoring = new Scoring();
    const id = req.params.id;
    const { team1, team2, fauteTeam1, fauteTeam2, nomTeam1, nomTeam2 } = req.body;
    console.log(req.body);
    scoring
      .update({ id, team1, team2, fauteTeam1, fauteTeam2, nomTeam1, nomTeam2 })
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

  getById(req, res) {
    const id = req.params.id;
    this.scoring
      .getById(id)
      .then((scoring) => {
        if (scoring) {
          res.status(200).json(scoring);
        } else {
          res.status(404).json({ message: "Scoring not found" });
        }
      })
      .catch((err) => {
        res.status(500).json({ message: err });
      });
  }

  getByUserId(req, res) {
    const userId = req.params.userId;
    this.scoring
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
