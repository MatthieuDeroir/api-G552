const nBytesToNumber = require('../Utils/nBytesToNumber');

/*
    * 0xAC : Guest Shirt Numbers Summary
 */

class Frame_0xAC {
    static build(_message) {
        const GSI = {
            insertType: 'DirectConsoleData',
        };

        GSI.Guest_PlayerNumber = new Array(16);

        for (let i = 0; i < 16; i++) {
            if (_message[4 + 2 * i] === 0x30 && _message[5 + 2 * i] === 0x30)
                GSI.Guest_PlayerNumber[i] = -3;
            else if (_message[4 + 2 * i] === 0x20 && _message[5 + 2 * i] === 0x30)
                GSI.Guest_PlayerNumber[i] = -2;
            else
                GSI.Guest_PlayerNumber[i] = nBytesToNumber(_message[4 + 2 * i], _message[5 + 2 * i])
        }
        return GSI;
    }

}

module.exports = Frame_0xAC;