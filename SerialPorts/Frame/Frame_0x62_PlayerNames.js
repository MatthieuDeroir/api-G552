const { StringDecoder } = require('string_decoder');

class Frame_0x62_PlayerNames {
    static build(message) {
        const decoder = new StringDecoder('utf16le');

        const GSI = {
            insertType: 'eGameStateInsertType.DirectConsoleData',
            guest_PlayerName: new Array(16),
            guest_PlayerNumber: new Array(16),
        };

        const reEncodedMessage = message.map((byte) => {
            if (byte === 0x20) {
                return 0x00;
            }
            return byte;
        });

        const indexPlayer = message[2] - 0x30 - 1;

        if (indexPlayer >= 0 && indexPlayer < 16) {
            GSI.guest_PlayerName[indexPlayer] = decoder.write(Buffer.from(reEncodedMessage.slice(3, 27)));
            if (reEncodedMessage[51] === 0x30 && reEncodedMessage[52] === 0x30) {
                GSI.guest_PlayerNumber[indexPlayer] = -3;
            } else if (reEncodedMessage[51] === 0x00 && reEncodedMessage[52] === 0x30) {
                GSI.guest_PlayerNumber[indexPlayer] = -2;
            } else {
                GSI.guest_PlayerNumber[indexPlayer] = reEncodedMessage[51] * 10 + reEncodedMessage[52];
            }
        }

        return GSI;
    }
}

module.exports = Frame_0x62_PlayerNames;