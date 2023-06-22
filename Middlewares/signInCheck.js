const jwt = require("jsonwebtoken");
const config = require("../config");

const checkToken = (req, res, next) => {
  const secret = config.secret;
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(403).send({ auth: false, message: "No token provided." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, secret);
    req.userId = decoded.id;

    // Vérifier l'inactivité de l'utilisateur
    const currentTime = Math.floor(Date.now() / 1000);
    const lastActivityTime = decoded.lastActivityTime; // Heure de la dernière activité stockée
      console.log('lastActivityTime', lastActivityTime);
    // Vérifier si la durée depuis la dernière activité dépasse 2 heures (7200 secondes)
    if (currentTime - lastActivityTime > 10) {
      return res.status(401).send({ auth: false, message: "Inactive user." });
    }

    // Mettre à jour l'heure de la dernière activité avec l'heure actuelle
    decoded.lastActivityTime = currentTime;

    // Générer un nouveau token avec l'heure de dernière activité mise à jour
    const newToken = jwt.sign(decoded, secret);

    // Ajouter le nouveau token à l'en-tête de la réponse
    res.setHeader("Authorization", `Bearer ${newToken}`);

    next();
  } catch (err) {
    console.log(err);
    return res.status(401).send({ auth: false, error: err.message });
  }
};

module.exports = checkToken;
