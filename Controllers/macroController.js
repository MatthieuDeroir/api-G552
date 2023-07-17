const Macro = require("../Models/macroModel");

class MacroController {
    constructor() {
        this.macro = new Macro();
    }
    create = (req, res) => {
        this.macro.create(req.body)
            .then((macro) => {
                res.status(201).json(macro);
            })
            .catch((err) => {
                res.status(500).json({message: err});
            });
    }

    update = (req, res) => {
        this.macro.update(req.body)
            .then((macro) => {
                res.status(200).json(macro);
            })
            .catch((err) => {
                res.status(500).json({message: err});
            });
    }

    getById= (req, res) => {
        this.macro.getById(req.params.id)
            .then((macro) => {
                if (macro) {
                    res.status(200).json(macro);
                } else {
                    res.status(404).json({message: 'Macro not found'});
                }
            })
            .catch((err) => {
                res.status(500).json({message: err});
            });
    }

    delete= (req, res) => {
        this.macro.delete(req.params.id)
            .then(() => {
                res.status(204).json();
            })
            .catch((err) => {
                res.status(500).json({message: err});
            });
    }

    getByUserId = (req, res) => {
        this.macro.getByUserId(req.params.id)
            .then((macros) => {
                res.status(200).json(macros);
            })
            .catch((err) => {
                res.status(500).json({message: err});
            });
    }

    getByButtonId = (req, res) => {
        this.macro.getByButtonId(req.params.id)
            .then((macros) => {
                res.status(200).json(macros);
            })
            .catch((err) => {
                res.status(500).json({message: err});
            });
    }

    getByEventId = (req, res) => {
        this.macro.getByEventId(req.params.id)
            .then((macros) => {
                res.status(200).json(macros);
            })
            .catch((err) => {
                res.status(500).json({message: err});
            });
    }


}

module.exports = MacroController;