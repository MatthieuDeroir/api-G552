const jwt = require("jsonwebtoken");
const config = require("../config");
const checkToken = (req, res, next) => {
  const secret = config.secret;
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(401).send({ auth: false, message: "No token provided." });
  }

  const token = authHeader.split(" ")[1];

  try {
    jwt.verify(token, secret); // Vérifie la validité du token, y compris l'expiration
    const decoded = jwt.decode(token);

    const expirationTime = Math.floor(Date.now() / 1000) + 2 * 60 * 60;

    if (expirationTime > decoded.exp) {
      console.log("expirationTime", decoded.exp);
      decoded.exp = expirationTime;

      const updatedToken = jwt.sign(decoded, secret);
      res.setHeader("Authorization", `Bearer ${updatedToken}`);
      return res.status(200).send({
        accessToken: updatedToken,
        message: "Token has been refreshed.",
      });
    }

    req.userId = decoded.id;
    next();
  } catch (err) {
    console.log(err);
    if (err.name === "TokenExpiredError") {
      return res
        .status(401)
        .send({ auth: false, message: "Token has expired." });
    } else {
      return res
        .status(500)
        .send({ auth: false, message: "Failed to authenticate token." });
    }
  }
};

module.exports = checkToken;
