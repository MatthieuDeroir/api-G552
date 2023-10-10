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
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(config.portAPI, () => {
    console.log(`API Server started on ${config.ip}:${config.portAPI}`);
});

const webSocketSetup = require("./Sockets/Websocket.js");
webSocketSetup(app);

const unixSocketSetup = require("./Sockets/Unixsocket.js");
unixSocketSetup.startServer();

const { SerialPortConnection, sharedEmitter } = require("./RSCOM/SerialPorts/SerialPortConnection");
const sp = new SerialPortConnection();

sp.StartReading();
sharedEmitter.on("data", (data) => {
    // console.log("## DATA RECEIVED ##");
    // console.log("...TRANSFER TO GAME...");
    // console.log("Data: ", data)
    Game.update(data);
});

let previousScoringData = { Timer: { Value: 0 } };
let previousMacrosData = null;

sharedEmitter.on("scoring", async (scoring) => {
    try {
        const macro = new MacroController();
        // console.log("Scoring Mode:", scoring.Mode);
        console.log("Scoring", scoring);

        if (scoring.Mode === 9) {
            // Only send data if it's different from the previous scoring data
            if (JSON.stringify(scoring.Timer.Value) !== JSON.stringify(previousScoringData.Timer.Value)) {
                console.log("Scoring datas were different from the previous one, sending data...")
                unixSocketSetup.sendData(scoring);
                previousMacrosData = null;
                previousScoringData = scoring; // Update the cache
            }
        } else if (scoring.Mode !== 9 || scoring.Mode !== null){
            const macrosData = await macro.getMacrosByButton(scoring.Mode);
            macrosData[0].Mode = scoring.Mode;
            // Only send data if it's different from the previous macros data
            if (JSON.stringify(macrosData[0]) !== JSON.stringify(previousMacrosData)) {
                console.log("Medias datas were different from the previous one, sending data...")
                unixSocketSetup.sendMedia(macrosData[0]);
                previousScoringData = null;
                previousMacrosData = macrosData[0]; // Update the cache
            }
            // console.log("Media Data:", macrosData[0]);
        }
    } catch (error) {
        console.error("Erreur lors de la récupération des macros:", error.message);
    }
});


sharedEmitter.on("media", (media) => {
    unixSocketSetup.sendMedia(media);
});

const authRoutes = require("./Routes/authRoutes");
app.use("/auth", authRoutes);
//Uncomment this line to activate token check
app.use(checkToken);
const activeSessionsRoutes = require("./Routes/activeSessionsRoutes");
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

const scoringTennisRoutes = require("./Routes/Scoring/tennisRoutes");
const scoringBadmintonRoutes= require("./Routes/Scoring/badmintonRoutes");

app.use("/activeSessions", activeSessionsRoutes);
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

app.use("/tennis", scoringTennisRoutes);
app.use("/badminton", scoringBadmintonRoutes);


app.get("/", (req, res) => {
    res.send(`Le serveur fonctionne sur le port ${config.portAPI}`);
});



module.exports = app;
