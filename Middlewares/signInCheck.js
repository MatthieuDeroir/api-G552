const jwt = require("jsonwebtoken");
const config = require("../config");

const checkToken = async (req, res, next) => {
  const secret = config.secret;
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(403).send({ auth: false, message: "No token provided." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, secret);
    req.userId = decoded.id;
    const RefreshToken = require("../Models/refreshTokenModel");

    const refreshTokenModel = new RefreshToken();
    const refreshToken = await refreshTokenModel.getByUserId(req.userId);

    const lastActivity = refreshToken ? refreshToken.last_activity : null;
    if (!refreshToken) {
      return res.status(401).send({ auth: false, message: "Token expired due to inactivity." });
    }
    if (lastActivity) {
      const currentTime = Math.floor(Date.now()); // Temps actuel en secondes
      const timeDifference = currentTime - lastActivity;
      if (timeDifference > 2 * 60 * 60 * 1000) {
        console.log("Token expired due to inactivity.");
        // Déconnexion de l'utilisateur en raison d'une inactivité de plus de 2 heures
        await refreshTokenModel.deleteByUserId(req.userId);
        return res.status(401).send({ auth: false, message: "Token expired due to inactivity." });
      } else {
        console.log("Token refreshed.");
        // Mise à jour de la dernière activité
        await refreshTokenModel.updateLastActivity(req.userId, currentTime);
      }
    }

    next();
  } catch (err) {
    console.log(err);
    return res.status(401).send({ auth: false, error: err.message });
  }
};

module.exports = checkToken;
