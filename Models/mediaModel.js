const db = require("../Database/db");
const crypto = require("crypto");
const fs = require("fs");

class Media {
    constructor() {
        this.createTable();
    }

    createTable() {
        const createTable = `
            CREATE TABLE IF NOT EXISTS media
            (
                id
                    INTEGER
                    PRIMARY
                        KEY,
                originalFileName
                    TEXT,
                fileName
                    TEXT,
                path
                    TEXT,
                format
                    TEXT,
                type
                    TEXT,
                lastModified
                    INTEGER,
                size
                    INTEGER,
                uploaded_at
                    TIMESTAMP
                    DEFAULT
                        CURRENT_TIMESTAMP,
                user_id
                    INTEGER,
                FOREIGN KEY
                    (
                     user_id
                        ) REFERENCES users
                    (
                     id
                        )
            )
        `;
        db.run(createTable);
    }

    create(file,username) {
        console.log(file);

        const originalFileName = file.originalname;

        const fileName = file.filename
        const lastModified = Date.now();
        const size = file.size;

        const path = file.path.split("public")[1];
        const format = file.mimetype.split("/")[1];
        const type = file.mimetype.split("/")[0];


        return new Promise((resolve, reject) => {
            db.run(
                `INSERT INTO media (originalFileName, fileName, lastModified, size, path, format, type)
                 VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [originalFileName, fileName, lastModified, size, path, format, type],
                function (err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(this.lastID);
                    }
                }
            );
        });
    }

    update(media) {
        return new Promise((resolve, reject) => {
            db.run(
                `UPDATE media
                 SET username = ?,
                     path     = ?,
                     type     = ?,
                     size     = ?
                 WHERE id = ?`,
                [media.name, media.path, media.type, media.size, media.id],
                (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(this.getById(media.id));
                    }
                }
            );
        });
    }

    getAll() {
        return new Promise((resolve, reject) => {
            db.all(
                `SELECT *
                 FROM media`,
                (err, media) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(media);
                    }
                }
            );
        });
    }

    getById(id) {
        return new Promise((resolve, reject) => {
            db.get(
                `SELECT *
                 FROM media
                 WHERE id = ?`,
                [id],
                (err, media) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(media);
                    }
                }
            );
        });
    }

    getByUserId(id) {
        return new Promise((resolve, reject) => {
            db.all(
                `SELECT *
                 FROM media
                 WHERE user_id = ?`,
                [id],
                (err, media) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(media);
                    }
                }
            );
        });
    }

    delete(id) {
        return new Promise((resolve, reject) => {
            db.run(
                `DELETE
                 FROM media
                 WHERE id = ?`,
                [id],
                (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                }
            );
        });
    }
    getByUsername(username) {
        console.log('tesr');
        return new Promise((resolve, reject) => {
          db.all(
            `SELECT *
                        FROM media
                        WHERE username = ?`,
            [username],
            (err, media) => {
              if (err) {
                reject(err);
              } else {
                resolve(media);
              }
            }
          );
        });
      }

}

module.exports = Media;
