const jwt = require("jsonwebtoken");
const config = require("../config");
const User = require("../Models/userModel");
const moment = require('moment');

const checkToken = async (req, res, next) => {
  const secret = config.secret;
  const authHeader = req.headers["authorization"];
  const userController = new User();

  if (!authHeader) {
    return res.status(200).send({ auth: false, message: "No token provided." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.decode(token,secret);
    const  user = await userController.getById( decoded.id );
    if (user.active_token !== token) {
      return res.status(401).json({ error: 'Token invalide' });
    }

    const inactivite = moment.duration(moment(new Date()).diff(user.last_activity)).asHours();
   

    if (inactivite > 2) {
      await userController.updateTokenAndActivity({ id: user.id , active_token: null });
      return res.status(401).json({ error: 'Déconnecté en raison d\'inactivité' });
    }

    await userController.updateTokenAndActivity({ id: user.id , last_activity:  new Date(), active_token: token });

    next();
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .send({ auth: false, message: "Failed to authenticate token." });
  }
};

module.exports = checkToken;
