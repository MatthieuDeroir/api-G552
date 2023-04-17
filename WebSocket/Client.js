const io = require('socket.io-client');
const socket = io('http://localhost:8080/ws/desk');

socket.emit('message', 'Hello World!');

