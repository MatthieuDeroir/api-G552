const EventMedia = require('../models/eventmediaModel')

class EventMediaController {
    constructor() {
        this.eventmedia = new EventMedia();
    }

    create = (req, res) => {
        this.eventmedia.create(req.body)
            .then((eventmedia) => {
                res.status(201).json(eventmedia);
            })
            .catch((err) => {
                res.status(500).json({message: err});
            });
    }

    getAllByEvent = (req, res) => {
        this.eventmedia.getAllByMedia(req.params.eventId)
            .then((eventmedias) => {
                res.status(200).json(eventmedias);
            })
            .catch((err) => {
                res.status(500).json({message: err});
            });
    }

    getAllByMedia = (req, res) => {
        this.eventmedia.getAllByMedia(req.params.media_id)
            .then((eventmedias) => {
                res.status(200).json(eventmedias);
            })
            .catch((err) => {
                res.status(500).json({message: err});
            });
    }


    delete = (req, res) => {
        this.eventmedia.delete(req.params.id)
            .then(() => {
                res.status(204).json();
            })
            .catch((err) => {
                res.status(500).json({
                    message:
                    err
                });
            });
    }

}

module.exports = EventMediaController;