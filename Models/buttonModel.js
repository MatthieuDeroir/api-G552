const db = require('../Database/db');


class Button {
    constructor() {
        this.createTable();

    }
    createTable() {
        const createTable = `
            CREATE TABLE IF NOT EXISTS button
            (
                id
                    INTEGER
                    PRIMARY
                        KEY,
                name  
                    TEXT
            )
        `;
        db.run(createTable);
    }

    create(button) {
        return new Promise((resolve, reject) => {
            db.run(
                `INSERT INTO button (name)
                 VALUES (?, ?)`,
                [button.name, button.userId],
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

    update(button) {
        return new Promise((resolve, reject) => {
            db.run(
                `UPDATE button
                 SET name = ?
                 WHERE id = ?`,
                [button.name, button.id],
                (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(this.getById(button.id));
                    }
                }
            );
        });
    }

    getAll() {
        return new Promise((resolve, reject) => {
            db.all(`SELECT *
                    FROM button`, (err, button) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(button);
                }
            });
        });
    }

    getById(id) {
        return new Promise((resolve, reject) => {
            db.get(`SELECT *
                    FROM button
                    WHERE id = ?`, [id], (err, button) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(button);
                }
            });
        });
    }

    delete(id) {
        return new Promise((resolve, reject) => {
            db.run(`DELETE
                    FROM button
                    WHERE id = ?`, [id], (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

}

module.exports = Button;