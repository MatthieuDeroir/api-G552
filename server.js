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
let previousMacrosData = null;

sharedEmitter.on("scoring", async (scoring) => {
    try {
        const macro = new MacroController();
        // console.log("Scoring Mode:", scoring.Mode);
        // console.log(scoring, "?", previousScoring)
        // scoring === previousScoring ? console.log('.') : console.log('{!}');
        //TODO: Parse, Save and Check if the scoring is different from the previous one
        if (scoring.Mode === 9) {
            unixSocketSetup.sendData(scoring);
            previousMacrosData = null;
        } else if (scoring.Mode === 0, 1, 2, 16, 17, 18, 19, 20) {
            unixSocketSetup.sendData(scoring);
            previousMacrosData = null;
        } else if (scoring.Mode == 3,4,5,6,7,8) {
            const macrosData = await macro.getMacrosByButton(scoring.Mode);
            console.log("Macro:", macrosData)
            macrosData[0].Mode = scoring.Mode;
            // Only send data if it's different from the previous macros data
            // if (JSON.stringify(macrosData[0]) !== JSON.stringify(previousMacrosData)) {
            //     console.log("Medias datas were different from the previous one, sending data...")
            unixSocketSetup.sendMedia(macrosData[0]);
            // previousScoring = 0;
            // previousMacrosData = macrosData[0]; // Update the cache
            // }
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
