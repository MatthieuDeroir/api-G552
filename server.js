const express = require("express");
const db = require("./Database/db");
const app = express();
const config = require("./config");
const bodyParser = require("body-parser");
const cors = require("cors");
const checkToken = require("./Middlewares/signInCheck");

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const SerialPortConnection = require("./Data/SerialPorts/serialPortConnection");
const sp = new SerialPortConnection();

const authRoutes = require("./Routes/authRoutes");
app.use("/auth", authRoutes);

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
const { emit } = require("process");

app.use("/scores", scoringRoutes);
app.use("/users", userRoutes);
app.use("/medias", mediaRoutes);
app.use("/events", eventRoutes);
app.use("/eventmedias", eventmediaRoutes);
app.use("/macros", macroRoutes);
app.use("/buttons", buttonRoutes);
app.use("/params", paramRoutes);
app.use("/veilles", veilleRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(config.portAPI, () => {
  console.log(`API Server started on ${config.ip}:${config.portAPI}`);
});

// Websocket
const server = require('http').Server(app)
const io = require('socket.io')(server);
const desk = io.of('/ws/desk');

server.listen(config.portWS, () => {
    console.log(`WebSocket Server started on ${config.ip}:${config.portWS}`);

});
let timerInterval;
let timerValue = 0;
const desk = io.of("/ws/desk");

desk.on("connection", (socket) => {
  
  socket.on("connect", () => {
    emit("connect");
    console.log("Connected to desk socket");
  });
  socket.on("message", (data) => {
    console.log(`Received message from desk`);
    console.log(data);

    // Envoyer un message au client
    desk.emit(
      "message",
      "Message du serveur vers le client avec le message envoyer par le client: " +
        data
    );
  });
  socket.on("getTimerValue", () => {
    socket.emit("timerValue", timerValue);
  });
  
  
  socket.on("timerUpdate", (data) => {
    timerValue = data;
    console.log(`Le client a mis à jour le minuteur à ${timerValue}`);
  });
  socket.on("startTimer", () => {
    console.log("Le client a démarré le minuteur");

    // Vérifier si le minuteur est déjà en cours d'exécution
    if (!timerInterval && timerValue > 0) {
      timerInterval = setInterval(() => {
        console.log(timerValue);
        timerValue -= 1;

        // Vérifier si le minuteur a atteint zéro
        if (timerValue === 0) {
          console.log("Le minuteur est arrivé à zéro");
          clearInterval(timerInterval);
          timerInterval = null;
        }

        // Émettre l'événement "timerUpdate" avec la valeur du minuteur aux clients connectés
        desk.emit("timerUpdate", timerValue);
      }, 1000);
    }
  });

  // Écoute de l'événement "stopTimer" émis par le client
  socket.on("stopTimer", () => {
    console.log("Le client a arrêté le minuteur");

    // Arrêter le minuteur et réinitialiser ses valeurs
    clearInterval(timerInterval);
    timerInterval = null;

    // Émettre l'événement "timerUpdate" avec la valeur réinitialisée aux clients connectés
    io.emit("timerUpdate", timerValue);
  });

  socket.on("startBuzzer", () => {
    console.log("Le client fait sonner le buzzer");
  });

  socket.on("disconnect", () => {
    console.log("Un client s'est déconnecté");
  });
});

server.listen(config.portWS, () => {
  console.log(`WS Server started on ${config.ip}:${config.portWS}`);
});
