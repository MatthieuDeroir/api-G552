const Macro = require("../Models/macroModel");
const db = require("../Database/db");
const ActiveSession = require("../Models/activeSessionModel");
const User = require("../Models/userModel");
const Event = require("../Models/eventModel");
const EventMedia = require("../Models/eventmediaModel");
const Media = require("../Models/mediaModel");

class MacroController {
    constructor() {
        this.macro = new Macro();
    }

    static async getMacrosByButton(buttonId) {
        const TWO_HOURS = 2 * 60 * 60 * 1000; // 2 heures en millisecondes

        // 1. Vérifier la session active
        const activeSession = await ActiveSession.getFirst().then((session) => {
            console.log("session", session);
        });
        // if (!activeSession) throw new Error("No active session found");

        const now = Date.now();
        const lastActivity = activeSession.last_activity;

        // if (now - lastActivity > TWO_HOURS) throw new Error("No user currently connected");

        const userId = activeSession.userId;

        // 2. Récupérer les macros pour l'utilisateur actif et le bouton donné
        const macros = await Macro.getByUserId(userId).then((macros) => {
            console.log("macros", macros);
        });
        const userMacrosForButton = macros.filter(macro => macro.button_id === buttonId).then((userMacrosForButton) => {
            console.log("userMacrosForButton", userMacrosForButton);
        });

        let results = [];

        for (let macro of userMacrosForButton) {
            // 3. Récupérer l'event associé à la macro
            const event = await Event.getById(macro.event_id).then((event) => {
                console.log("event", event);
            });

            // 4. Récupérer les médias pour l'event
            const mediaList = await EventMedia.getAllByEvent(event.id).then((mediaList) => {
                console.log("mediaList", mediaList);
            });
            let medias = [];

            for (let mediaInfo of mediaList) {
                const media = await Media.getById(mediaInfo.media_id).then((media) => {
                    console.log("media", media);
                });
                medias.push({
                    order: mediaInfo.media_pos_in_event,
                    path: media.path,
                    duration: mediaInfo.media_dur_in_event
                });
            }

            // 5. Ajouter au tableau final
            results.push({
                event: event,
                medias: medias
            });
        }

        console.log("results", results)

        return results;
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