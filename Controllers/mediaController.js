const Media = require("../Models/mediaModel");
const fs = require("fs");
const multer = require("multer");
const crypto = require("crypto");

class MediaController {
  constructor() {
    this.storage = multer.diskStorage({
      destination: (req, file, cb) => {
        const username = req.params.user;
        const userFolder = `../G552_frontend/public/medias/${username}`;
        cb(null, userFolder);
      },
      filename: (req, file, cb) => {
        const hash = crypto.createHash("sha256");
        hash.update(file.name + Date.now().toString());
        const fileName = hash.digest("hex");
        cb(null, fileName + "." + file.mimetype.split("/")[1]);
        file.filename = fileName;
      },
    });
    this.upload = multer({ storage: this.storage });
    this.media = new Media();
  }

  create = (req, res) => {
    console.log(req.body);
    this.upload.single("file")(req, res, (err) => {
      if (err) {
        console.log(err);
        res.status(500).json({ message: err });
      } else {
        const username = req.params.user;
        this.media
          .create(req.file, username)
          .then((media) => {
            res.status(201).json(media);
          })
          .catch((err) => {
            res.status(500).json({ message: err });
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
        res.status(500).json({ message: err });
      });
  };

  getAll = (req, res) => {
    this.media
      .getAll()
      .then((medias) => {
        res.status(200).json(medias);
      })
      .catch((err) => {
        res.status(500).json({ message: err });
      });
  };

  getById = (req, res) => {
    console.log(req.params.id);
    this.media
      .getById(req.params.id)
      .then((media) => {
        if (media) {
          res.status(200).json(media);
        } else {
          res.status(404).json({ message: "Media not found" });
        }
      })
      .catch((err) => {
        res.status(500).json({ message: err });
      });
  };

  getByUserId = (req, res) => {
    console.log('test');
    this.media
      .getByUserId(req.params.user)
      .then((media) => {
        if (media) {
          res.status(200).json(media);
        } else {
          res.status(404).json({ message: "Media not found" });
        }
      })
      .catch((err) => {
        res.status(500).json({ message: err });
      });
  };

  delete = (req, res) => {
    this.media
      .getById(req.params.id)
      .then((file) => {
        const filePath = file.path;
        console.log(filePath);
        fs.unlink("../G552_frontend/public/" + filePath, (err) => {
          if (err) {
            console.log(err);
            return res.status(500).json({ error: err });
          } else {
            this.media
              .delete(req.params.id)
              .then(() => {
                console.log("delete OK");
                return res
                  .status(204)
                  .json({ message: "File deleted successfully" });
              })
              .catch((err) => {
                console.log(err);
                return res.status(500).json({ message: err });
              });
          }
        });
      })
      .catch((err) => {
        res.status(500).json({ message: err });
      });
  };
}

module.exports = MediaController;
