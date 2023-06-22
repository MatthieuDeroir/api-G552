const db = require("../Database/db");

class EventMedia {
  constructor() {
    this.createTable();
  }

  createTable() {
    const createTable = `
        CREATE TABLE IF NOT EXISTS event_media
        (
            id INTEGER PRIMARY KEY,
            event_id INTEGER,
            media_id INTEGER,
            media_dur_in_event INTEGER,
            media_pos_in_event INTEGER
        )
    `;
    db.run(createTable);
}


  create(event) {
    return new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO event_media (event_id, media_id, media_dur_in_event, media_pos_in_event)
                 VALUES (?, ?, ?, ?)`,
        [event.eventId, event.mediaId, event.duration, 1],
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
    console.log("getAllByEvent", eventId);
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT media.*, event_media.media_pos_in_event, event_media.media_dur_in_event, event_media.id AS event_media_id
        FROM event_media
        JOIN media ON event_media.media_id = media.id
        WHERE event_media.event_id = ?
        `,
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

  getAllByMedia(mediaId) {
    return new Promise((resolve, reject) => {
      db.all(
        "SELECT * FROM event_media WHERE media_id = ?",
        [mediaId],
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
      db.run("DELETE FROM event_media WHERE media_id = ?", [mediaId], (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
}

  deleteAllByEventId(eventId) {
    return new Promise((resolve, reject) => {
      db.run("DELETE FROM event_media WHERE event_id = ?", [eventId], (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
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

  updateMediaPositions(event_media_id, newPosition) {
    console.log("updateMediaPositions");
    return new Promise((resolve, reject) => {
      db.run(
        `UPDATE event_media
         SET media_pos_in_event = ?
         WHERE id = ?`,
        [newPosition, event_media_id],
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
  updateDuration(eventId, mediaId, duration) {
    return new Promise((resolve, reject) => {
      db.run(
        `UPDATE event_media
         SET media_dur_in_event = ?
         WHERE event_id = ? AND media_id = ?`,
        [duration, eventId, mediaId],
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
