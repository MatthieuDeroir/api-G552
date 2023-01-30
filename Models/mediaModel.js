const db = require('../Database/db');
const crypto = require('crypto');
const fs = require('fs')

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
                username
                TEXT,
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
                CURRENT_TIMESTAMP
            )
        `;
        db.run(createTable);
    }

    // create(media) {
    //     return new Promise((resolve, reject) => {
    //         db.run(
    //             `INSERT INTO media (user_id, name, path, type, size) VALUES (?, ?, ?, ?, ?)`,
    //             [media.user_id, media.name, media.path, media.type, media.size],
    //             (err) => {
    //                 if (err) {
    //                     reject(err);
    //                 } else {
    //                     resolve(this.getById(this.lastID));
    //                 }
    //             }
    //         );
    //     });
    // }

    create(file) {
        const originalFileName = file.name;
        const hash = crypto.createHash('sha256');
        hash.update(file.name + Date.now());
        const fileName = hash.digest('hex');
        const lastModified = file.lastModified;
        const size = file.size;
        const path = file.path;
        const format = file.mimetype.split('/')[1];
        const type = file.mimetype.split('/')[0];

        return new Promise((resolve, reject) => {
            db.run(`INSERT INTO media (originalFileName, fileName, lastModified, size, path, format, type)
                    VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [originalFileName, fileName, lastModified, size, path, format, type],
                function (err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(this.lastID);
                    }
                });
        });
    }

    update(media) {
        return new Promise((resolve, reject) => {
            db.run(
                `UPDATE media
                 SET username = ?,
                     path = ?,
                     type = ?,
                     size = ?
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
            db.all(`SELECT *
                    FROM media`, (err, media) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(media);
                }
            });
        });
    }

    getById(id) {
        return new Promise((resolve, reject) => {
            db.get(`SELECT *
                    FROM media
                    WHERE id = ?`, [id], (err, media) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(media);
                }
            });
        });
    }

    delete(id) {
        return new Promise((resolve, reject) => {
            db.run(`DELETE
                    FROM media
                    WHERE id = ?`, [id], (err) => {
                if (err) {
                    reject(err);
                } else {
// Also delete the file from the file system
                    fs.unlink("./uploads/${id}", (err) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve();
                        }
                    });
                }
            });
        });
    }

    getByUsername(username) {
        return new Promise((resolve, reject) => {
            db.all(`SELECT *
                    FROM media
                    WHERE username = ?`, [username], (err, media) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(media);
                }
            });
        });
    }
}


module.exports = Media;

