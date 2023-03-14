const db = require("../Database/db");

class EventMedia {
  constructor() {
    this.createTable();
  }

  createTable() {
    const createTable = `
            CREATE TABLE IF NOT EXISTS event_media
            (
                event_id
                INTEGER,
                media_id
                INTEGER,
                user_id
                INTEGER,
                duration
                INTEGER,
                PRIMARY
                KEY
            (
                event_id,
                media_id,
                user_id
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
            ),
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

  create(mediaId,eventId , duration,userId) {
    return new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO event_media (event_id, media_id,user_id, duration)
                 VALUES (?, ?, ?, ?)`,
        [eventId, mediaId, userId,duration],
        (err) => {
          if (err) {
            console.log(err);
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
      db.all(
        `SELECT media.*
                    FROM event_media
                             JOIN media ON event_media.media_id = media.id
                    WHERE event_media.event_id = ?`,
        [eventId],
        (err, medias) => {
          if (err) {
            reject(err);
          } else {
            resolve(medias);
          }
        }
      );
    });
  }

  getAllByMedia(mediaId, userId) {

    return new Promise((resolve, reject) => {
      db.all(
        "SELECT * FROM event_media WHERE media_id = ? AND user_id = ?",
        [mediaId, userId],
        (err, events) => {
          if (err) {
            reject(err);
          } else {
            resolve(events);
          }
        }
      );
    });
  }
  

  deleteAllByMedia(mediaId) {
    return new Promise((resolve, reject) => {
      db.run(
        `DELETE FROM event_media WHERE media_id = ?`,
        [mediaId],
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
