const db = require('../Database/db');
const fs = require('fs')

class Macro {
    constructor() {
        this.createTable();
    }
    createTable() {
        const createTable = `
            CREATE TABLE IF NOT EXISTS macro
            (
                id
                    INTEGER
                    PRIMARY
                        KEY,
                button_id
                    INTEGER,
                event_id
                    INTEGER,
                user_id
                    INTEGER,
                FOREIGN KEY
                    (
                     user_id
                        ) REFERENCES users
                    (
                     id
                        ),
                FOREIGN KEY
                    (
                     event_id
                        ) REFERENCES events
                    (
                     id
                        ),
                FOREIGN KEY
                    (
                     button_id
                        ) REFERENCES button
                    (
                     id
                        )
            )
        `;
        db.run(createTable);
    }
    create(button_id, eventId, userId) {
        return new Promise((resolve, reject) => {
            db.run(
                `INSERT INTO macro (button_id, event_id, user_id)
                 VALUES (?, ?, ?)`,
                [button_id, eventId, userId],
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

    getById(id) {
        return new Promise((resolve, reject) => {
            db.get("SELECT * FROM macro WHERE id = ?", [id], (err, macro) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(macro);
                }
            });
        });
    }
    getByUserId(userId) {
        return new Promise((resolve, reject) => {
            db.all("SELECT * FROM macro WHERE user_id = ?", [userId], (err, macros) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(macros);
                }
            });
        });
    }



    update(id, button_id, eventId, userId) {
        return new Promise((resolve, reject) => {
            db.run(
                `UPDATE macro SET button_id = ?, event_id = ?, user_id = ? WHERE id = ?`,
                [button_id, eventId, userId, id],
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



    delete(id) {
        return new Promise((resolve, reject) => {
            db.run("DELETE FROM macro WHERE id = ?", [id], (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }


}

module.exports = Macro;