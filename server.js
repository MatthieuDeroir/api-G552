// Basics
const express = require('express')
const db = require('./Database/db');
const app = express()
const config = require('./config');

// Serial port
const SerialPortConnection = require('./SerialPorts/serialPort');
const sp = new SerialPortConnection();

// Middleware
const userRoutes = require('./Routes/userRoutes');
const mediaRoutes = require('./Routes/mediaRoutes');
const eventmediaRoutes = require('./Routes/eventmediaRoutes');
// const fileRoutes = require('./Routes/fileRoutes');
const eventRoutes = require('./Routes/eventRoutes');

// Routes
app.use('/users', userRoutes);
// app.use('/files', fileRoutes);
app.use('/medias', mediaRoutes);
app.use('/events', eventRoutes);
app.use('/eventmedias', eventmediaRoutes);


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(config.portAPI, () => {
    console.log(`API Server started on ${config.ip}:${config.portAPI}`)
})

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
})



app.get('/ws/desk', (req, res) => {
});


