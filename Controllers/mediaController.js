const Media = require("../Models/mediaModel");
const fs = require("fs");
const multer = require("multer");
const crypto = require("crypto");

class MediaController {
    constructor() {
        this.storage = multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, "../G552_frontend/public/medias");
            },
            filename: (req, file, cb) => {
                const hash = crypto.createHash("sha256");
                hash.update(file.name + Date.now().toString());
                const fileName = hash.digest("hex");
                console.log(fileName);
                cb(null, fileName + "." + file.mimetype.split("/")[1]);
                file.filename = fileName;
            },
        });
        this.upload = multer({storage: this.storage});
        this.media = new Media();
    }

    create = (req, res) => {
        this.upload.single("file")(req, res, (err) => {
            if (err) {
                res.status(500).json({message: err});
            } else {
                this.media
                    .create(req.file)
                    .then((media) => {
                        res.status(201).json(media);
                    })
                    .catch((err) => {
                        res.status(500).json({message: err});
                    });
            }
        });
    };

    update = (req, res) => {
        this.media
            .update(req.body)
            .then((media) => {
                res.status(200).json(media);
            })
            .catch((err) => {
                res.status(500).json({message: err});
            });
    };

    getAll = (req, res) => {
        this.media
            .getAll()
            .then((medias) => {
                res.status(200).json(medias);
            })
            .catch((err) => {
                res.status(500).json({message: err});
            });
    };

    getById = (req, res) => {
        this.media
            .getById(req.params.id)
            .then((media) => {
                if (media) {
                    res.status(200).json(media);
                } else {
                    res.status(404).json({message: "Media not found"});
                }
            })
            .catch((err) => {
                res.status(500).json({message: err});
            });
    };

    delete = (req, res) => {
        this.media.getById(req.params.id)
            .then((file) => {
                const fileName = file.fileName;
                const filePath = file.path;
                fs.unlink(filePath, (err) => {
                    if (err) {
                        return res.status(500).json({error: err});
                    } else {
                        this.media.delete(req.params.id)
                            .then(() => {
                                res.status(204).json({message: 'File deleted successfully'});
                            })
                            .catch((err) => {
                                res.status(500).json({message: err});
                            });
                    }
                });
            }).catch((err) => {
            res.status(500).json({message: err});
        })
    }
}

module.exports = MediaController;
