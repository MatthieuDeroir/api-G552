const db = require('../Database/db');

class Event {
    constructor() {
        this.createTable();
    }

    createTable() {
        const createTable = `
            CREATE TABLE IF NOT EXISTS events
            (
                id       INTEGER PRIMARY KEY,
                name     TEXT,

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

    create(event) {
        console.log(event);
        return new Promise((resolve, reject) => {
            db.run(
                `INSERT INTO events (name, user_id) VALUES (?, ?)`,
                [event.name, event.userId],
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

    update(event) {
        return new Promise((resolve, reject) => {
            db.run(
                `UPDATE events SET name = ?, category = ? WHERE id = ?`,
                [event.name, event.category, event.id],
                (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(this.getById(event.id));
                    }
                }
            );
        });
    }

    getAll() {
        return new Promise((resolve, reject) => {
            db.all(`SELECT * FROM events`, (err, events) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(events);
                }
            });
        });
    }

    getById(id) {
        return new Promise((resolve, reject) => {
            db.get(`SELECT * FROM events WHERE id = ?`, [id], (err, event) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(event);
                }
            });
        });
    }

    getByUserId(id) {
        return new Promise((resolve, reject) => {
            db.all(`SELECT * FROM events WHERE user_id = ?`, [id], (err, events) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(events);
                }
            });
        });
    }

    delete(id) {
        return new Promise((resolve, reject) => {
            db.run(`DELETE FROM events WHERE id = ?`, [id], (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }
}

module.exports = Event