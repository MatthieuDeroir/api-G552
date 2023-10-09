const Macro = require("../Models/macroModel");
const db = require("../Database/db");
const ActiveSession = require("../Models/activeSessionModel");
const User = require("../Models/userModel");
const Event = require("../Models/eventModel");
const Eventmedia = require("../Models/eventmediaModel");
const mMedia = require("../Models/mediaModel");

class MacroController {
    constructor() {
        const activeSession = new ActiveSession();
        const user = new User();
        const event = new Event();
        const eventmedia = new EventMedia();
        const media = new Media();
        this.macro = new Macro();
    }

    async getMacrosByButton(buttonId) {
        const TWO_HOURS = 2 * 60 * 60 * 1000; // 2 heures en millisecondes

        // 1. Vérifier la session active
        const activeSession = await activeSession.getFirst();
        if (!activeSession) throw new Error("No active session found");

        const now = Date.now();
        // const lastActivity = activeSession.last_activity;

        // if (now - lastActivity > TWO_HOURS) throw new Error("No user currently connected");

        const userId = activeSession.userId;

        console.log("userId", userId);

        // 2. Récupérer les macros pour l'utilisateur actif et le bouton donné
        let macro = new Macro();
        const macros = await macro.getByUserId(userId)

        console.log("macros", macros);

        const userMacrosForButton = macros.filter(macro => macro.button_id === buttonId)

        console.log("userMacrosForButton", userMacrosForButton);


        let results = [];

        for (let macro of userMacrosForButton) {
            // 3. Récupérer l'event associé à la macro
            const event = await event.getById(macro.event_id).then((event) => {
                console.log("event", event);
            });

            // 4. Récupérer les médias pour l'event
            const mediaList = await eventmedia.getAllByEvent(event.id).then((mediaList) => {
                console.log("mediaList", mediaList);
            });
            let medias = [];

            for (let mediaInfo of mediaList) {
                const media = await media.getById(mediaInfo.media_id).then((media) => {
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