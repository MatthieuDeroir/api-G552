const { StringDecoder } = require('string_decoder');

/*
    * 0x62 : Team Names
 */

class Frame_0x62_TeamNames {
    static build(_message) {
        const UTF16 = new StringDecoder('utf16le');

        const GSI = {
            insertType: 'DirectConsoleData',
        };

        let reEncodedMessage = [..._message];

        for (let i = 0; i < _message.length; i++) {
            if (reEncodedMessage[i] === 32) {
                reEncodedMessage[i] = 0;
            }
            i++;
        }

        GSI.homeTeamName = UTF16.write(Buffer.from(reEncodedMessage.slice(6, 24)));
        if (reEncodedMessage[24] !== 0x00 && reEncodedMessage[25] !== 0x00) {
            GSI.homeTeamName += UTF16.write(Buffer.from(reEncodedMessage.slice(24, 26)));
        }

        GSI.guestTeamName = '';
        if (reEncodedMessage[28] !== 0x00 && reEncodedMessage[29] !== 0x00) {
            GSI.guestTeamName = UTF16.write(Buffer.from(reEncodedMessage.slice(28, 30)));
        }
        GSI.guestTeamName += UTF16.write(Buffer.from(reEncodedMessage.slice(30, 48)));

        return GSI;
    }
};

module.exports = Frame_0x62_TeamNames;
