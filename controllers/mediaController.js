const Media = require('../models/mediaModel')
class MediaController {
    constructor() {
        this.media = new Media();
    }

    create = (req, res) => {
        this.media.create(req.body)
            .then((media) => {
                res.status(201).json(media);
            })
            .catch((err) => {
                res.status(500).json({message: err});
            });
    }

    update = (req, res) => {
        this.media.update(req.body)
            .then((media) => {
                res.status(200).json(media);
            })
            .catch((err) => {
                res.status(500).json({message: err});
            });
    }

    getAll= (req, res) => {
        this.media.getAll()
            .then((medias) => {
                res.status(200).json(medias);
            })
            .catch((err) => {
                res.status(500).json({message: err});
            });
    }

    getById= (req, res) => {
        this.media.getById(req.params.id)
            .then((media) => {
                if (media) {
                    res.status(200).json(media);
                } else {
                    res.status(404).json({message: 'Media not found'});
                }
            })
            .catch((err) => {
                res.status(500).json({message: err});
            });
    }

    delete= (req, res) => {
        this.media.delete(req.params.id)
            .then(() => {
                res.status(204).json();
            })
            .catch((err) => {
                res.status(500).json({message: err});
            });
    }
}

module.exports = MediaController;
