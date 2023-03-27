const db = require('../Database/db.js');

const checkDuplicateUsername = async (req, res, next) => {
    db.get(`SELECT * FROM users WHERE username = ?`, [req], (err, row) => {
        if (err) {
           console.log(err);
            res.status(500).send({ message: err });
            return;
        }
        if (row) {
            console.log('Username already in use');
            res.status(400).send({ message: "Failed! Username is already in use!" });
            return;
        }
    });
}

const checkPasswordRequirements = (req, res, next) => {
    if (req.length < 8) {
        console.log('Password must be at least 8 characters long');
        res.status(400).send({ message: "Failed! Password must be at least 8 characters long!" });
        return;
    }
    if (req.search(/[a-z]/i) < 0) {
        console.log('Password must contain at least one letter');
        res.status(400).send({ message: "Failed! Password must contain at least one letter!" });
        return;
    }
    if (req.search(/[0-9]/) < 0) {
        console.log('Password must contain at least one digit');
        res.status(400).send({ message: "Failed! Password must contain at least one digit!" });
        return;
    }
}

const verifyRoles = (req, res, next) => {
    console.log(req);
    if (req  !== 'root' && req  !== 'admin' && req  !== 'user') {
        res.status(400).send({ message: "Failed! Role must be either 'root', 'admin' or 'user'!" });
        return;
    }
}

const signUpCheck = {
    checkDuplicateUsername,
    checkPasswordRequirements,
    verifyRoles
}

module.exports = signUpCheck;