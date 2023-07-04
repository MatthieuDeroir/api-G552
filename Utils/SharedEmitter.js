// utils/eventEmitter.js
const EventEmitter = require('events');
class SharedEmitter extends EventEmitter {}

const sharedEmitter = new SharedEmitter();

sharedEmitter.on('updated', (data) => {
    // Handle the event here, e.g. send the data over a unix socket or whatever you need to do
    console.log('Data updated:', data);
});

module.exports = sharedEmitter;
// utils/SharedEmitter.js