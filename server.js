// Basics
const express = require("express");
const db = require("./Database/db");
const app = express();
const config = require("./config");
const bodyParser = require("body-parser");
const cors = require("cors");
const checkToken = require("./Middlewares/signInCheck");

// Middleware

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serial port
const SerialPortConnection = require("./Data/SerialPorts/serialPortConnection");
const sp = new SerialPortConnection();

// Routes
const authRoutes = require("./Routes/authRoutes");
const userRoutes = require("./Routes/userRoutes");

app.use("/users", userRoutes);
app.use("/auth", authRoutes);

app.use(checkToken);

const mediaRoutes = require("./Routes/mediaRoutes");
const eventmediaRoutes = require("./Routes/eventmediaRoutes");
const eventRoutes = require("./Routes/eventRoutes");
const macroRoutes = require("./Routes/macroRoutes");
const buttonRoutes = require("./Routes/buttonRoutes");
const paramRoutes = require("./Routes/paramRoutes");
const veilleRoutes = require("./Routes/veilleRoutes");

app.use("/medias", mediaRoutes);
app.use("/events", eventRoutes);
app.use("/eventmedias", eventmediaRoutes);
app.use("/macros", macroRoutes);
app.use("/buttons", buttonRoutes);
app.use("/params", paramRoutes);
app.use("/veilles", veilleRoutes);

// API
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(config.portAPI, () => {
  console.log(`API Server started on ${config.ip}:${config.portAPI}`);
});

// Websocket
const server = require("http").Server(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
const desk = io.of("/ws/desk");

server.listen(config.portWS, () => {
  console.log(`WS Server started on ${config.ip}:${config.portWS}`);
});
const { exec } = require("child_process");

// Sur Windows :
exec(
  "wmic logicaldisk get Size, FreeSpace /format:value",
  function (err, stdout, stderr) {
    if (err) {
      console.error(err);
    } else {
      const lines = stdout.split("\n");
      const sizeInBytes = lines;
      const availableInBytes = parseInt(lines[2].split("=")[1]);
      const sizeInGo = sizeInBytes / 1e9;
      const availableInGo = availableInBytes / 1e9;
      console.log(`Size: ${sizeInGo} Go, Available: ${availableInGo} Go`);
    }
  }
);
desk.on("connection", (socket) => {
  socket.on("connect", (data) => {
    console.log(`Connected to desk socket`);
  });
  socket.on("frame", (data) => {
    console.log(`Received frame from desk`);
    console.log(data);
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
  socket.on("disconnect", () => {
    console.log(`Disconnected from desk socket`);
  });
});
