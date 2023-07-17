const db = require("../Database/db");
const EventEmitter = require('events');


class Mode {
    constructor() {
        this.createTable();
        this.events = new EventEmitter();
    }

    createTable() {
        const createTable = `
            CREATE TABLE IF NOT EXISTS modes
            (
                id
                    INTEGER
                    PRIMARY
                        KEY,
                mode
                    TEXT,
                    event_id
                    
                    INTEGER,
                FOREIGN KEY
                    (
                        event_id
                    ) REFERENCES events
                    (
                        id
                        )
            )
        `;
        db.run(createTable);
    }

    create(mode) {
        return new Promise((resolve, reject) => {
            db.run(
                `INSERT INTO modes (mode, event_id) VALUES (?, ?)`,
                [mode.mode, mode.eventId || null],
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

    update(mode) {
        return new Promise((resolve, reject) => {
            db.run(
                `UPDATE modes SET mode = ?, event_id = ? WHERE id = ?`,
                [mode.mode, mode.eventId || null, mode.id],
                (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        this.events.emit('updated', mode);
                        resolve();
                    }
                }
            );
        });
    }


    delete(id) {
        return new Promise((resolve, reject) => {
            db.run(
                `DELETE FROM modes WHERE id = ?`,
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

    getAll() {
        return new Promise((resolve, reject) => {
            db.all(
                `SELECT * FROM modes`,
                (err, modes) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(modes);
                    }
                }
            );
        });
    }
}

module.exports = Mode;