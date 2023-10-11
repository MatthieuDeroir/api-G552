const nBytesToNumber = require("../nBytesToNumber");

function TimeOut(digit1, digit2, digit3) {
    return nBytesToNumber(digit1).toString() + nBytesToNumber(digit2).toString() + "." + nBytesToNumber(digit3).toString();

}

module.exports = TimeOut;