const db = require('../Database/db.js');

const checkDuplicateUsername = (req, res, next) => {
    db.get(`SELECT * FROM users WHERE username = ?`, [req.body.username], (err, row) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
        if (row) {
            res.status(400).send({ message: "Failed! Username is already in use!" });
            return;
        }
        next();
    });
}

const checkPasswordRequirements = (req, res, next) => {
    if (req.body.password.length < 8) {
        res.status(400).send({ message: "Failed! Password must be at least 8 characters long!" });
        return;
    }
    if (req.body.password.search(/[a-z]/i) < 0) {
        res.status(400).send({ message: "Failed! Password must contain at least one letter!" });
        return;
    }
    if (req.body.password.search(/[0-9]/) < 0) {
        res.status(400).send({ message: "Failed! Password must contain at least one digit!" });
        return;
    }
    next();
}

const verifyRoles = (req, res, next) => {
    if (req.body.role !== 'root' && req.body.role !== 'admin' && req.body.role !== 'user') {
        res.status(400).send({ message: "Failed! Role must be either 'root', 'admin' or 'user'!" });
        return;
    }
    next();
}

const signUpCheck = {
    checkDuplicateUsername,
    checkPasswordRequirements,
    verifyRoles
}

module.exports = signUpCheck;