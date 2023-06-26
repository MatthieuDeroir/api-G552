const RefreshToken = require('../Models/refreshTokenModel');

class RefreshTokenController {
    constructor() {
        this.refreshToken = new RefreshToken();
    }

    create = (req, res) => {
        const { token, userId } = req.body;
        this.refreshToken.create({ token, user: userId })
            .then((newRefreshToken) => {
                res.status(201).json(newRefreshToken);
            })
            .catch((err) => {
                res.status(500).json({ message: 'Erreur lors de la création du refresh token.', error: err });
            });
    }

    delete = (req, res) => {
        const { token } = req.body;
        this.refreshToken.delete(token)
            .then(() => {
                res.status(200).json({ message: 'Refresh token supprimé avec succès.' });
            })
            .catch((err) => {
                res.status(500).json({ message: 'Erreur lors de la suppression du refresh token.', error: err });
            });
    }

    verify = (req, res) => {
        const { token } = req.body;
        this.refreshToken.getByToken(token)
            .then((refreshToken) => {
                if (refreshToken) {
                    res.status(200).json({ message: 'Refresh token valide.' });
                } else {
                    res.status(400).json({ message: 'Refresh token invalide.' });
                }
            })
            .catch((err) => {
                res.status(500).json({ message: 'Erreur lors de la vérification du refresh token.', error: err });
            });
    }
   
}

module.exports = RefreshTokenController;
