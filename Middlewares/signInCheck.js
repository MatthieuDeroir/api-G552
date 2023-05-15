const jwt = require('jsonwebtoken');
const config = require('../config');

const checkToken = (req, res, next) => {
  const secret = config.secret;
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(403).send({ auth: false, message: 'No token provided.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.decode(token);

    if (Date.now() > decoded.exp * 1000) {
      return res.status(401).send({ auth: false, message: 'Token expired.' });
    }

    // Vérifier si la date d'expiration est proche (par exemple, dans les 5 minutes)
    const expirationTime = decoded.exp * 1000;
    const currentTime = Date.now();
    const timeDifference = expirationTime - currentTime;
    const closeExpirationThreshold = 5 * 60 * 1000; // 5 minutes en millisecondes

    if (timeDifference < closeExpirationThreshold) {
      // Le token est proche de l'expiration, ne pas ajouter les 2 heures supplémentaires
      req.userId = decoded.id;
    } else {
      // Le token est valide, ajouter les 2 heures supplémentaires
      const updatedExpirationTime = Math.floor(Date.now() / 1000) + (2 * 60 * 60);
      decoded.exp = updatedExpirationTime;
      const updatedToken = jwt.sign(decoded, secret);
      res.setHeader('Authorization', `Bearer ${updatedToken}`);
      req.userId = decoded.id;
    }

    next();
  } catch (err) {
    console.log(err);
    return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
  }
};

module.exports = checkToken;
