const express = require("express");
const db = require("./Database/db");
const app = express();
const config = require("./config");
const bodyParser = require("body-parser");
const cors = require("cors");
const checkToken = require("./Middlewares/signInCheck");
const Game = require("./RSCOM/Game");
const MacroController = require("./Controllers/macroController");

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.listen(config.portAPI, () => {
    console.log(`API Server started on ${config.ip}:${config.portAPI}`);
});

const webSocketSetup = require("./Sockets/Websocket.js");
webSocketSetup(app);

const unixSocketSetup = require("./Sockets/Unixsocket.js");
unixSocketSetup.startServer();

const {SerialPortConnection, sharedEmitter} = require("./RSCOM/SerialPorts/SerialPortConnection");
const sp = new SerialPortConnection();

sp.StartReading();
sharedEmitter.on("data", (data) => {
    // console.log("## DATA RECEIVED ##");
    // console.log("...TRANSFER TO GAME...");
    // console.log("Data: ", data)
    Game.update(data);
});

let previousScoring = 0;
let previousMacrosDataMode = null;

sharedEmitter.on("scoring", async (scoring) => {
    try {
        const macro = new MacroController();
        // console.log("Scoring Mode:", scoring.Mode);
        // console.log(scoring, "?", previousScoring)
        // scoring === previousScoring ? console.log('.') : console.log('{!}');
        //TODO: Parse, Save and Check if the scoring is different from the previous one
        console.log("Scoring Mode:", scoring.Mode);
        if (scoring.Mode === 9) {
            unixSocketSetup.sendData(scoring);
            previousMacrosDataMode = null;
        } else if (scoring.Mode === 0 || scoring.Mode === 1 || scoring.Mode === 2 || scoring.Mode === 16 || scoring.Mode === 17 || scoring.Mode === 18 || scoring.Mode === 19 || scoring.Mode === 20) {
            unixSocketSetup.sendData(scoring);
            previousMacrosDataMode = null;
        } else if (scoring.Mode === 3 || scoring.Mode === 4 || scoring.Mode === 5 || scoring.Mode === 6 || scoring.Mode === 7 || scoring.Mode === 8) {
            const macrosData = await macro.getMacrosByButton(scoring.Mode);

            // console.log(scoring.Mode, "!==", previousMacrosDataMode)
            // console.log("Medias datas were different from the previous one, sending data...")
            macrosData[0].Mode = scoring.Mode;
            previousMacrosDataMode = scoring.Mode; // Update the cache
            unixSocketSetup.sendMedia(macrosData[0]);
            // unixSocketSetup.sendData(scoring);

            // if (!macrosData) {
            //     scoring.Mode = 9;
            //     unixSocketSetup.sendData(scoring);
            //     console.log("No event for this macro, sending Mode", scoring.Mode)
            //
            // } else {
            //     // Only send data if it's different from the previous macro's data
            //
            // }


        }
    } catch (error) {
        console.error("Erreur lors de la récupération des macros:", error.message);
    }
});


sharedEmitter.on("media", (media) => {
    unixSocketSetup.sendMedia(media);
});

const authRoutes = require("./Routes/authRoutes");
const activeSessionsRoutes = require("./Routes/activeSessionsRoutes");
app.use("/activeSessions", activeSessionsRoutes);
app.use("/auth", authRoutes);
//Uncomment this line to activate token check
app.use(checkToken);

const userRoutes = require("./Routes/userRoutes");
const scoringRoutes = require("./Routes/scoringRoutes");
const mediaRoutes = require("./Routes/mediaRoutes");
const eventmediaRoutes = require("./Routes/eventmediaRoutes");
const eventRoutes = require("./Routes/eventRoutes");
const macroRoutes = require("./Routes/macroRoutes");
const buttonRoutes = require("./Routes/buttonRoutes");
const paramRoutes = require("./Routes/paramRoutes");
const veilleRoutes = require("./Routes/veilleRoutes");
const modeRoutes = require("./Routes/modeRoutes");

app.use("/scores", scoringRoutes);
app.use("/users", userRoutes);
app.use("/medias", mediaRoutes);
app.use("/events", eventRoutes);
app.use("/eventmedias", eventmediaRoutes);
app.use("/macros", macroRoutes);
app.use("/buttons", buttonRoutes);
app.use("/params", paramRoutes);
app.use("/veilles", veilleRoutes);
app.use("/mode", modeRoutes);


app.get("/", (req, res) => {
    res.send(`Le serveur fonctionne sur le port ${config.portAPI}`);
});


module.exports = app;
