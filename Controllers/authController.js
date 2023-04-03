const User = require("../Models/userModel");
const bcrypt = require("bcrypt");
const config = require("../config");
const verification = require("../Middlewares/signUpCheck");
const jwt = require("jsonwebtoken");
const fs = require("fs");

const signUp = async (req, res) => {
  const folderName = `../G552_frontend/public/medias/${req.body.username}`;
  const user = {
    username: req.body.username,
    password: req.body.password,
    role: req.body.role,
  };


  try {
    verification.checkDuplicateUsername(user.username);
    verification.checkPasswordRequirements(user.password);
    verification.verifyRoles(user.role);

    const newUser = new User();
    console.log(fs.existsSync(folderName));
    if (!fs.existsSync(folderName)) {
        console.log("Folder created");
      fs.mkdirSync(folderName);
    } else {
      res.status(418).json({ message: "Folder already exists" });
    }

    const createdUser = await newUser
      .create(user)
      .then((user) => {
        res.status(201).json(createdUser);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ message: err });
      });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

const signIn = async (req, res) => {
    
  const user = {
    username: req.body.username,
    password: req.body.password,
  };

  try {
    const userController = new User();
    const foundUser = await userController.getByUsername(user.username);

    if (foundUser) {
        
      bcrypt.compare(user.password, foundUser.password, function (err, result) {
        if (err) {
          console.log(err);
          return res.status(500).json({ message: err });
        } else {
          if (result) {
            const secret = config.secret;
            const accessToken = jwt.sign({ id: foundUser.id }, secret, {
              expiresIn: 8 * 60 * 60, // expires in 8 hours (8 * 60 * 60 s)
            });
            return res.status(200).send({
              accessToken: accessToken,
              user: foundUser,
            });
          } else {
            console.log("Invalid Password!");
            return res.status(401).send({
              accessToken: null,
              message: "Invalid Password!",
            });
          }
        }
      });
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err });
  }
};

const authentification = {
  signUp,
  signIn,
};

module.exports = authentification;
