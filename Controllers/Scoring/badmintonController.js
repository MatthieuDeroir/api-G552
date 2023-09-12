const BadmintonScore = require('../../Models/Scoring/badmintonModels');

class BadmintonController {
    constructor() {
        this.badmintonScore = new BadmintonScore();
    }

    create = (req, res) => {
        this.badmintonScore.create(req.body)
            .then((badmintonScore) => {
                res.status(201).json(badmintonScore);
            })
            .catch((err) => {
                res.status(500).json({message: err});
            });
    }

    updateScore = (req, res) => {
        console.log(req.body);
        this.badmintonScore.updateScore(req.body)
            .then((badmintonScore) => {
                res.status(200).json(badmintonScore);
            })
            .catch((err) => {
                res.status(500).json({message: err});
            });
    }

    getAll = (req, res) => {
        this.badmintonScore.getAll()
            .then((badmintonScores) => {
                res.status(200).json(badmintonScores);
            })
            .catch((err) => {
                res.status(500).json({message: err});
            });
    }

    getScoreById = (req, res) => {
        this.badmintonScore.getScoreById(req.params.id)
            .then((badmintonScore) => {
                if (badmintonScore) {
                    res.status(200).json(badmintonScore);
                } else {
                    res.status(404).json({message: 'Score not found'});
                }
            })
            .catch((err) => {
                res.status(500).json({message: err});
            });
    }

    deleteScoreById = (req, res) => {
        this.badmintonScore.deleteScoreById(req.params.id)
            .then(() => {
                res.status(204).json();
            })
            .catch((err) => {
                res.status(500).json({message: err});
            });
    }
}

module.exports = BadmintonController;
