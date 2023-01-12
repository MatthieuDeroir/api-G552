const db = require('../config/db');

class EventMedia {
    constructor() {
        this.createTable();
    }

    createTable() {
        const createTable = `
        CREATE TABLE IF NOT EXISTS event_media (
            id INTEGER PRIMARY KEY,
            event_id INTEGER,
            media_id INTEGER,
            FOREIGN KEY (event_id) REFERENCES events(id),
            FOREIGN KEY (media_id) REFERENCES media(id)
        )
        `;
        db.run(createTable);
    }

    create(eventId, mediaId) {
        return new Promise((resolve, reject) => {
            db.run(
                `INSERT INTO event_media (event_id, media_id) VALUES (?, ?)`,
                [eventId, mediaId],
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

    delete(eventId, mediaId) {
        return new Promise((resolve, reject) => {
            db.run(
                `DELETE FROM event_media WHERE event_id = ? AND media_id = ?`,
                [eventId, mediaId],
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


    getAllByEvent(eventId) {
        return new Promise((resolve, reject) => {
            db.all(`SELECT media.* FROM event_media JOIN media ON event_media.media_id = media.id WHERE event_media.event_id = ?`, [eventId], (err, medias) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(medias);
                }
            });
        });
    }

    getAllByMedia(mediaId){
        return new Promise((resolve, reject) => {
            db.all("SELECT * FROM event_media WHERE media_id = ?", [mediaId], (err, events) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(events);
                }
            });
        });
    }
    addMedia(eventId, mediaId) {
        return new Promise((resolve, reject) => {
            db.run('INSERT INTO event_media (event_id, media_id) VALUES (?, ?)', [eventId, mediaId], (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(this.getAllByEvent(eventId));
                }
            });
        });
    }

    removeMedia(eventId, mediaId) {
        return new Promise((resolve, reject) => {
            db.run("DELETE FROM event_media WHERE event_id = ? AND media_id = ?", [eventId, mediaId], (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(this.getAllByEvent(eventId));
                }
            });
        });
    }
}

module.exports = EventMedia;
