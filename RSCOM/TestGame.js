const Game = require("./Game");
const sharedEmitter = require('../Utils/SharedEmitter');
console.log("Test file started");


console.log("About to emit the data event");
// Game.update(TestMessage);
try {
    sharedEmitter.emit('data', TestMessage);
} catch (error) {
    console.error("Error while emitting event:", error);
}

module.export = TestMessage;