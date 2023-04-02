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

  create(event) {
    console.log(event);
    return new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO event_media (event_id, media_id, media_dur_in_event, media_pos_in_event)
                 VALUES (?, ?, ?, ?)`,
        [
          event.eventId,
          event.mediaId,
          event.mediaDurInEvent,
          event.mediaPosInEvent,
        ],
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

  updateMediaPositions(eventId, mediaPositions) {
  console.log("updateMediaPositions");
  console.log(mediaPositions);
    // mediaPositions est un tableau contenant la position de chaque média dans l'événement
    return new Promise((resolve, reject) => {
      // on commence par récupérer tous les EventMedia de l'événement
      db.all(
        `SELECT *
             FROM event_media
             WHERE event_id = ?`,
        [eventId],
        (err, rows) => {
          if (err) {
            reject(err);
          } else {
            // on parcourt tous les EventMedia récupérés
            console.log(rows);
            rows.forEach((row) => {
              // on récupère la position actuelle du média
              const currentPosition = row.media_pos_in_event;
              // on calcule la nouvelle position du média en fonction du tableau mediaPositions
              const newPosition = mediaPositions.findIndex(
                (pos) => pos.id === row.id
              );
              // si la position a changé, on met à jour la base de données
              if (currentPosition !== newPosition) {
                db.run(
                  `UPDATE event_media
                                 SET media_pos_in_event = ?
                                 WHERE event_id = ?
                                   AND media_id = ?`,
                  [newPosition, eventId, row.media_id],
                  (err) => {
                    if (err) {
                      reject(err);
                    }
                  }
                );
              }
            });
            resolve();
          }
        }
      );
    });
  }
}

module.exports = EventMedia;
