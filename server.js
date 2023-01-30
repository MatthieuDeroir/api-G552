// Basics
const express = require('express')
const db = require('./Database/db');
const app = express()
const config = require('./config');
const bodyParser = require('body-parser');
const cors = require('cors');

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serial port
const SerialPortConnection = require('./SerialPorts/serialPortConnection');
const sp = new SerialPortConnection();

// Routes
const userRoutes = require('./Routes/userRoutes');
const mediaRoutes = require('./Routes/mediaRoutes');
const eventmediaRoutes = require('./Routes/eventmediaRoutes');
const eventRoutes = require('./Routes/eventRoutes');
const macroRoutes = require('./Routes/macroRoutes');
const buttonRoutes = require('./Routes/buttonRoutes');

app.use('/users', userRoutes);
app.use('/medias', mediaRoutes);
app.use('/events', eventRoutes);
app.use('/eventmedias', eventmediaRoutes);
app.use('/macros', macroRoutes);
app.use('/buttons', buttonRoutes);


app.get('/', (req, res) => {
    res.send('Hello World!')
});

app.listen(config.portAPI, () => {
    console.log(`API Server started on ${config.ip}:${config.portAPI}`)
});

// Websocket
const server = require('http').Server(app)
const io = require('socket.io')(server);
const desk = io.of('/ws/desk');

server.listen(config.portWS, () => {
    console.log(`WS Server started on ${config.ip}:${config.portWS}`);
});



desk.on('connection', (socket) => {
    socket.on('connect', (data) => {
        console.log(`Connected to desk socket`);
    });
    socket.on('frame', (data) => {
        console.log(`Received frame from desk`);
        console.log(data);
    });
});

