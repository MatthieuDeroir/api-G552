const jwt = require("jsonwebtoken");
const config = require("../config");

const checkToken = (req, res, next) => {
  const secret = config.secret;
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(200).send({ auth: false, message: "No token provided." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.decode(token);
    const expirationTime = Math.floor(Date.now() / 1000) + 2; // Ajouter 2 heures

    if (expirationTime > decoded.exp) {
      // Mettre à jour la date d'expiration du token
      decoded.exp = expirationTime;

      // Signer le token avec la nouvelle date d'expiration
      const updatedToken = jwt.sign(decoded, secret);

      // Mettre à jour l'en-tête "Authorization" avec le token mis à jour
      res.setHeader("Authorization", `Bearer ${updatedToken}`);
    }

    req.userId = decoded.id;

    next();
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .send({ auth: false, message: "Failed to authenticate token." });
  }
};

module.exports = checkToken;
