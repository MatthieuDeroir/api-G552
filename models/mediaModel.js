const db = require('../config/db');
const fs = require('fs')

class Media {
    constructor() {
        this.createTable();
    }

    createTable() {
        const createTable = `
        CREATE TABLE IF NOT EXISTS media (
            id INTEGER PRIMARY KEY,
            user_id INTEGER,
            name TEXT,
            path TEXT,
            type TEXT,
            size INTEGER,
            uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        `;
        db.run(createTable);
    }

    create(media) {
        return new Promise((resolve, reject) => {
            db.run(
                `INSERT INTO media (user_id, name, path, type, size) VALUES (?, ?, ?, ?, ?)`,
                [media.user_id, media.name, media.path, media.type, media.size],
                (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(this.getById(this.lastID));
                    }
                }
            );
        });
    }

    update(media) {
        return new Promise((resolve, reject) => {
            db.run(
                `UPDATE media SET name = ?, path = ?, type = ?, size = ? WHERE id = ?`,
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
            db.all(`SELECT * FROM media`, (err, media) => {
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
            db.get(`SELECT * FROM media WHERE id = ?`, [id], (err, media) => {
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
            db.run(`DELETE FROM media WHERE id = ?`, [id], (err) => {
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
}

module.exports = Media;

