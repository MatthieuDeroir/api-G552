const db = require('../Database/db');
const bcrypt = require('bcrypt');

class User {
    constructor() {
        this.createTable();
    }

    createTable() {
        const createTable = `
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY,
            username TEXT,
            password TEXT,
            role TEXT
        )
        `;
        db.run(createTable);
    }

    create(user) {
        return new Promise((resolve, reject) => {
            bcrypt.hash(user.password, 10, (err, hash) => {
                if (err) {
                    reject(err);
                } else {
                    db.run(
                        `INSERT INTO users (username, password, role) VALUES (?, ?, ?)`,
                        [user.username, hash, user.role],
                        (err) => {
                            if (err) {
                                reject(err);
                            } else {
                                resolve(this.getById(this.lastID));
                            }
                        }
                    );
                }
            });
        });
    }

    update(user) {
        return new Promise((resolve, reject) => {
            bcrypt.hash(user.password, 10, (err, hash) => {
                if (err) {
                    reject(err);
                } else {
                    db.run(
                        `UPDATE users SET username = ?, password = ?, role = ? WHERE id = ?`,
                        [user.username, hash, user.role, user.id],
                        (err) => {
                            if (err) {
                                reject(err);
                            } else {
                                resolve(this.getById(user.id));
                            }
                        }
                    );
                }
            });
        });
    }

    getByUsername(username) {
        return new Promise((resolve, reject) => {
            db.get(`SELECT * FROM users WHERE username = ?`, [username], (err, user) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(user);
                }
            });
        });
    }

    getAll() {
        console.log('getAll')
        return new Promise((resolve, reject) => {
            db.all(`SELECT * FROM users`, (err, users) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(users);
                }
            });
        });
    }

    getById(id) {
        return new Promise((resolve, reject) => {
            db.get(`SELECT * FROM users WHERE id = ?`, [id], (err, user) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(user);
                }
            });
        });
    }

    delete(id) {
        return new Promise((resolve, reject) => {
            db.run(`DELETE FROM users WHERE id = ?`, [id], (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }
}

module.exports = User;
