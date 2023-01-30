const User = require('../Models/userModel');
const bcrypt = require('bcrypt');
const verification = require('../Middlewares/signUpVerification');

const signUp = async (req, res) => {
    const folderName = `../frontend/public/medias/${req.body.username}`;
    const user = {
        username: req.body.username,
        password: req.body.password,
        role: req.body.role
    };
    try {
        verification.checkDuplicateUsername(user.username)
        verification.checkPasswordRequirements(user.password)
        verification.verifyRoles(user.role)

        const salt = bcrypt.genSaltSync(10);
        user.password = bcrypt.hashSync(user.password, salt);
        const newUser = new User();
        const createdUser = await newUser.create()
            .then((user) => {
                res.status(201).json(createdUser);
            })
            .catch((err) => {
                res.status(500).json({ message: err });
            });
    }   catch (err) {
        res.status(500).json({ message: err });
    }
}

const signIn = async (req, res) => {
    const user = {
        username: req.body.username,
        password: req.body.password
    };
    try {
        const user = new User();
        const foundUser = await user.getByUsername(user.username)
            .then((user) => {
                if (user) {
                    res.status(200).json(user);
                } else {
                    res.status(404).json({ message: 'User not found' });
                }
            })
            .catch((err) => {
                res.status(500).json({ message: err });
            });
        if (foundUser) {
            const passwordIsValid = bcrypt.compareSync(user.password, foundUser.password);
            if (!passwordIsValid) {
                return res.status(401).send({
                    accessToken: null,
                    message: "Invalid Password!"
                });
            }
            res.status(200).json(foundUser);
        }
    }   catch (err) {
        res.status(500).json({ message: err });
    }
}

const authentification = {
    signUp,
    signIn
}

module.exports = authentification;