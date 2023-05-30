const io = require('socket.io-client');

const socket = io('ws://localhost:8080/ws/desk');

socket.on('connect', () => {
    console.log('Connected to desk socket');
})