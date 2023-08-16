const ActiveSession = require("../Models/activeSessionModel");

class ActiveSessionController {
  constructor() {
    this.activeSession = new ActiveSession();
  }

  create = (req, res) => {
    this.activeSession
      .create(req.body)
      .then((session) => {
        res.status(201).json(session);
      })
      .catch((err) => {
        res.status(500).json({ message: err });
      });
  };

  update = (req, res) => {
    this.activeSession
      .update(req.body)
      .then((session) => {
        res.status(200).json(session);
      })
      .catch((err) => {
        res.status(500).json({ message: err });
      });
  };

  getByUserId = (req, res) => {
    console.log("getByUserId", req);
    this.activeSession
      .getByUserId(req)
      .then((session) => {
        res.status(200).json(session);
      })
      .catch((err) => {
        res.status(500).json({ message: err });
      });
  };

  getAll = (req, res) => {
    this.activeSession
      .getAll()
      .then((sessions) => {
        res.status(200).json(sessions);
      })
      .catch((err) => {
        res.status(500).json({ message: err });
      });
  };

  delete = (req, res) => {
    this.activeSession
      .delete(req.params.userId)
      .then(() => {
        res.status(204).json();
      })
      .catch((err) => {
        res.status(500).json({ message: err });
      });
  };

  findOne = () => {
    return new Promise((resolve, reject) => {
      this.activeSession
        .findOne()
        .then((session) => {
          resolve(session);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

}

module.exports = ActiveSessionController;