const Mode = require("../Models/modeModel");
const net = require('net');
const socketPath = '/tmp/_sysmes.sock';
const sharedEmitter = require('../Utils/SharedEmitter');



class ModeController {
    constructor() {
        this.mode = new Mode();
        this.client = net.createConnection({ path: socketPath }, () => {
            console.log('Connected to server!');
        });
        this.mode.events.on('updated', (data) => {
            this.client.write(JSON.stringify(data) + '\n');
        });
    }

    create = (req, res) => {
        this.mode.create(req.body)
            .then(() => {
                res.status(201).json({ message: 'Modes created successfully' });
            })
            .catch((err) => {
                res.status(500).json({ message: err });
            });
    }

    update = (req, res) => {
        this.mode.update(req.body)
            .then(() => {
                sharedEmitter.emit('updated', req.body);
                res.status(200).json({ message: 'Modes updated successfully' });
            })
            .catch((err) => {
                res.status(500).json({ message: err });
            });
    }

    getAll = (req, res) => {
        this.mode.getAll()
            .then((modes) => {
                res.status(200).json(modes);
            })
            .catch((err) => {
                res.status(500).json({ message: err });
            });
    }

    delete = (req, res) => {
        this.mode.delete(req.params.id)
            .then(() => {
                res.status(204).json();
            })
            .catch((err) => {
                res.status(500).json({ message: err });
            });
    }
}

module.exports = ModeController;