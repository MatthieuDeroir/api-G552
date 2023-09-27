const nBytesToNumber = require('../nBytesToNumber');

function Chrono(..._message) {
    let Chrono = "";
    if (_message[3] === 0x20) {
        Chrono = nBytesToNumber(_message[0]).toString() + nBytesToNumber(_message[1]).toString() + "." + nBytesToNumber(_message[2]).toString();
    } else {
        Chrono = nBytesToNumber(_message[0]).toString() +  nBytesToNumber(_message[1]).toString() + ":" + nBytesToNumber(_message[2]).toString() + nBytesToNumber(_message[3]).toString();

        console.log(_message)

        console.log(Chrono)
    }
    return Chrono;
}

module.exports = Chrono;