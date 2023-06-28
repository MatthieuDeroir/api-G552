// utils/eventEmitter.js
const EventEmitter = require('events');
class SharedEmitter extends EventEmitter {}

const sharedEmitter = new SharedEmitter();

module.exports = sharedEmitter;
// utils/SharedEmitter.js