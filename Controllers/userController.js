const User = require("../Models/userModel");

class UserController {
  constructor() {
    this.user = new User();
  }
  create = (req, res) => {
    this.user
      .create(req.body)
      .then((user) => {
        res.status(201).json(user);
      })
      .catch((err) => {
        res.status(500).json({ message: err });
      });
  };

  update = (req, res) => {
    this.user
      .update(req.body)
      .then((user) => {
        res.status(200).json(user);
      })
      .catch((err) => {
        res.status(500).json({ message: err });
      });
  };

  changePassword = (req, res) => {
    console.log("changePassword");
    console.log(req.params.id);
    this.user
      .changePassword(req.body,req.params.id)
      .then((user) => {
        res.status(200).json(user);
      })
      .catch((err) => {
        res.status(500).json({ message: err });
      });
  };

  getByUsername = (req, res) => {
    this.user
      .getByUsername(req.params.username)
      .then((user) => {
        res.status(200).json(user);
      })
      .catch((err) => {
        res.status(500).json({ message: err });
      });
  };

  getAll = (req, res) => {
    console.log(this.user);
    this.user
      .getAll()
      .then((users) => {
        res.status(200).json(users);
      })
      .catch((err) => {
        res.status(500).json({ message: err });
      });
  };

  getById = (req, res) => {
    this.user
      .getById(req.params.id)
      .then((user) => {
        if (user) {
          res.status(200).json(user);
        } else {
          res.status(404).json({ message: "User not found" });
        }
      })
      .catch((err) => {
        res.status(500).json({ message: err });
      });
  };

  delete = (req, res) => {
    this.user
      .delete(req.params.id)
      .then(() => {
        res.status(204).json();
      })
      .catch((err) => {
        res.status(500).json({ message: err });
      });
  };
}

module.exports = UserController;
