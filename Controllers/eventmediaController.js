const EventMedia = require("../Models/eventmediaModel");

class EventMediaController {
  constructor() {
    this.eventmedia = new EventMedia();
  }

  create = (req, res) => {
    this.eventmedia
      .create(req.body)
      .then((eventmedia) => {
        res.status(201).json(eventmedia);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ message: err });
      });
  };

  getAllByEvent = (req, res) => {
    this.eventmedia
      .getAllByEvent(req.params.eventId)
      .then((eventmedias) => {
        res.status(200).json(eventmedias);
      })
      .catch((err) => {
        res.status(500).json({ message: err });
      });
  };

  getAllByMedia = (req, res) => {
    this.eventmedia
      .getAllByMedia(req.params.media_id)
      .then((eventmedias) => {
        res.status(200).json(eventmedias);
      })
      .catch((err) => {
        res.status(500).json({ message: err });
      });
  };

  delete = (req, res) => {
    const eventId = req.params.id;
    const mediaId = req.body.idBdd;
    this.eventmedia
      .delete(eventId,mediaId)
      .then(() => {
        res.status(204).json();
      })
      .catch((err) => {
        res.status(500).json({
          message: err,
        });
      });
  };
  deleteAllByMedia = (req, res) => {
    const mediaId = req.params.id;
    this.eventmedia
      .deleteAllByMedia(mediaId)
      .then(() => {
        res.status(204).json();
      })
      .catch((err) => {
        res.status(500).json({
          message: err,
        });
      });
  };
  updateMediaPositions = (req, res) => {
    const mediaPositions = req.body;
    const promises = mediaPositions.map((positionData) => {
      const eventId = positionData.eventId;
      const mediaId = positionData.mediaId;
      const newPosition = positionData.media_pos_in_event;
      return this.eventmedia.updateMediaPositions(eventId, mediaId, newPosition);
    });
    Promise.all(promises)
      .then(() => {
        res.sendStatus(200);
      })
      .catch((err) => {
        console.error(err);
        res.sendStatus(500);
      });
  };

  updateMediaDuration = (req, res) => {
    const { eventId, mediaId, duration } = req.body;

    this.eventmedia
      .updateDuration(eventId, mediaId, duration)
      .then(() => {
        res.sendStatus(200);
      })
      .catch((err) => {
        console.error(err);
        res.sendStatus(500);
      });
  };

}

module.exports = EventMediaController;
