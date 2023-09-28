const User = require("../Models/userModel");
const ActiveSession = require("../Models/activeSessionModel");
const bcrypt = require("bcrypt");
const config = require("../config");
const verification = require("../Middlewares/signUpCheck");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const { log } = require("console");

const signUp = async (req, res) => {
  console.log(req.body);
  const folderName = `../../Server/Frontend/public/medias/${req.body.username}`;
  const user = {
    username: req.body.username,
    password: req.body.password,
    role: req.body.role,
  };

  try {
    const isDuplicate = await verification.checkDuplicateUsername(
      user.username
    );
    if (isDuplicate) {
      return res
        .status(400)
        .json({ message: "Le nom d'utilisateur est déjà utilisé" });
    }

    const passwordRequirements = await verification.checkPasswordRequirements(
      user.password
    );
    console.log(passwordRequirements);
    if (!passwordRequirements.result) {
      console.log("Les exigences du mot de passe ne sont pas satisfaites");
      return res.status(400).json({ message: passwordRequirements.message });
    }

    /*  const rolesVerified = await verification.verifyRoles(user.role);
    if (!rolesVerified.result) {
      console.log("Les rôles ne sont pas valides");
      return res.status(400).json({ message: rolesVerified.message });
    } */

    console.log("signUp");
    const newUser = new User();
    console.log(fs.existsSync(folderName));
    if (!fs.existsSync(folderName)) {
      console.log("Folder does not exist");
      await fs.mkdirSync(folderName);
      console.log("Folder created");
    }

    const createdUser = await newUser
      .create(user)
      .then((user) => {
        res.status(201).json(user);
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).json({ message: err });
      });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: err.message });
  }
};

const signIn = async (req, res) => {
  const user = {
    username: req.body.username,
    password: req.body.password,
  };

  try {
    const userController = new User();
    const activeSessionModel = new ActiveSession();
    console.log(user.username);
    const foundUser = await userController.getByUsername(user.username);
    console.log("foundUser", foundUser);
    if (foundUser) {
      bcrypt.compare(
        user.password,
        foundUser.password,
        async function (err, result) {
          if (err) {
            console.log(err);
            return res.status(500).json({ message: err });
          } else {
            if (result) {
              if (foundUser.firstLogin === 1) {
                console.log("First login");
              }

              const activeSession = await activeSessionModel.getAll();
              if (!activeSession.activeToken) {
                if (activeSession.last_activity > 2) {
                  await activeSessionModel.updateOne({
                    active_token: null,
                    last_activity: null,
                  });
                }
              } else {
                console.log("Un autre utilisateur est déjà connecté");
                return res.status(409).json({
                  error: "Un autre utilisateur est déjà connecté",
                });
              }

              const secret = config.secret;
              const accessToken = jwt.sign({ id: foundUser.id }, secret);

              await userController.updateTokenAndActivity({
                id: foundUser.id,
                active_token: accessToken,
              });

              await activeSessionModel.updateOne({
                active_token: accessToken,
                userId: foundUser.id,
                last_activity: new Date(),
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
        }
      );
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err });
  }
};
const modifyPassword = async (req, res) => {
  console.log(req.body);
  const newUser = new User();
  const user = {
    id: req.params.id,
    newPassword: req.body.newPassword,
  };
  try {
    const passwordRequirements = await verification.checkPasswordRequirements(
      user.newPassword
    );
    console.log(passwordRequirements);
    if (!passwordRequirements.result) {
      console.log("Les exigences du mot de passe ne sont pas satisfaites");
      return res.status(400).json({ message: passwordRequirements.message });
    }

    await newUser
      .changePassword(user)
      .then((user) => {
        newUser.updateFirstLogin(user.id);
        res.status(201).json(user);
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).json({ message: err });
      });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: err.message });
  }
};

const authentification = {
  signUp,
  signIn,
  modifyPassword,
};

module.exports = authentification;
