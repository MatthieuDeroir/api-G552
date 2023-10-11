const nBytesToNumber = require("../nBytesToNumber");

function TimeOut(digit1, digit2, digit3) {
    TimeOut = nBytesToNumber(digit1.toString() + nBytesToNumber(digit2).toString() + "." + nBytesToNumber(digit3).toString());
    return TimeOut;
}

module.exports = TimeOut;