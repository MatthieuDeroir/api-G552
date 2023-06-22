const db = require('../Database/db');

class EventMedia {
    constructor() {
        this.createTable();
        this.createTrigger();
    }

    createTable() {
        const createTable = `
            CREATE TABLE IF NOT EXISTS event_media
            (
                event_id
                    INTEGER,
                media_id
                    INTEGER,
                media_dur_in_event
                    INTEGER,
                media_pos_in_event
                    INTEGER,
                PRIMARY
                    KEY
                    (
                     event_id,
                     media_id
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
                     media_id
                        ) REFERENCES media
                    (
                     id
                        )
            )
        `;
        db.run(createTable);
    }

    createTrigger() {
        const createTrigger = `
            CREATE TRIGGER IF NOT EXISTS event_media_same_user
            BEFORE INSERT ON event_media
            BEGIN
              SELECT 
                CASE 
                  WHEN (SELECT User_id FROM Media WHERE id = NEW.media_id) = (SELECT User_id FROM Event WHERE id = NEW.event_id) 
                  THEN NULL
                  ELSE RAISE(ABORT, 'Media and Event must have the same User id')
                END;
            END;
        `;
        db.run(createTrigger);
    }

    create(eventId, mediaId, mediaDurInEvent, mediaPosInEvent) {
        return new Promise((resolve, reject) => {
            db.run(
                `INSERT INTO event_media (event_id, media_id, media_dur_in_event, media_pos_in_event)
                 VALUES (?, ?, ?, ?)`,
                [eventId, mediaId, mediaDurInEvent, mediaPosInEvent],
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
            db.all(`SELECT media.*
                    FROM event_media
                             JOIN media ON event_media.media_id = media.id
                    WHERE event_media.event_id = ?`, [eventId], (err, medias) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(medias);

                }
            });
        });
    }

    getAllByMedia(mediaId) {
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

    delete(eventId, mediaId) {
        return new Promise((resolve, reject) => {
            db.run(
                `DELETE
                 FROM event_media
                 WHERE event_id = ?
                   AND media_id = ?`,
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
}


module.exports = EventMedia;
