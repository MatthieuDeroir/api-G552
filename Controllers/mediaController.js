const Media = require('../Models/mediaModel')
const fs = require('fs')
const multer = require('multer');


class MediaController {
    constructor() {
        this.media = new Media();
        this.storage = multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, 'uploads/');
            },
            filename: function (req, file, cb) {
                cb(null, file.originalname);
            }
        });
        this.upload = multer({ storage: this.storage });
    }

    create = (req, res) => {
        this.upload.single('file')(req, res, (err) => {
            if (err) {
                res.status(500).json({message: err});
            } else {
                const file = req.file;
                this.media.create(req.body, file)
                    .then((media) => {
                        res.status(201).json(media);
                    })
                    .catch((err) => {
                        res.status(500).json({message: err});
                    });
            }
        });
    }

    // create = (req, res) => {
    //     this.media.create(req.body)
    //         .then((media) => {
    //             res.status(201).json(media);
    //         })
    //         .catch((err) => {
    //             res.status(500).json({message: err});
    //         });
    // }

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
        const fileName = req.params.fileName;
        const filePath = 'uploads/' + fileName;
        fs.unlink(filePath, (err) => {
            if (err) {
                return res.status(500).json({ error: err });
            } else {
                this.media.delete(req.params.id)
                    .then(() => {
                        res.status(204).json({ message: 'File deleted successfully' });
                    })
                    .catch((err) => {
                        res.status(500).json({message: err});
                    });
            }
        });
    }
}

module.exports = MediaController;
