const { StringDecoder } = require('string_decoder');
const Encode = require('../Utils/Encode');
const Tools = require('../Utils/Frame_Tools/Frame_Tools_index');
/*
    * 0x62 : Team Names
 */

class Frame_0x62_TeamNames {
    static build(_message) {
        const UTF16 = new StringDecoder('utf16le');

        const GSI = {
            insertType: 'DirectConsoleData',
        };

        let reEncodedMessage = Encode(_message);

        GSI.Home_TeamName = Tools.TeamName(6, reEncodedMessage);

        GSI.Guest_TeamName = Tools.TeamName(30, reEncodedMessage);

        return GSI;
    }
};

module.exports = Frame_0x62_TeamNames;
