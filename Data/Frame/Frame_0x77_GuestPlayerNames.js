const {StringDecoder} = require('string_decoder');
const Encode = require('../Utils/Encode');
const Tools = require('../Utils/Frame_Tools/Frame_Tools_index');

/*
    * 0x62 : Player Names and shirt numbers of the players
 */

// This class is used to process and build the 0x62 frame
class Frame_0x62_PlayerNames {
    // This static method is used to build the 0x62 frame
    static build(_message) {
        // Create a string decoder with UTF-16LE encoding
        const decoder = new StringDecoder('utf16le');

        // Initialize the GSI object
        const GSI = {
            // This property specifies the type of insert
            insertType: 'eGameStateInsertType.DirectConsoleData',
            // This property stores the player names
            Guest_PlayerName: new Array(16),
            // This property stores the player numbers
            Guest_PlayerNumber: new Array(16),
        };

        // Re-encode the _message by replacing 0x20 with 0x00
        let reEncodedMessage = Encode(_message);

        // Calculate the index of the player
        let Guest = Tools.PlayerName(_message[2], reEncodedMessage);
        GSI.Guest_PlayerName[Guest.indexPlayer] = Guest.playerName;
        GSI.Guest_PlayerNumber[Guest.indexPlayer] = Guest.playerNumber;

        // Return the GSI object
        return GSI;
    }
}

// Export the Frame_0x62_PlayerNames class
module.exports = Frame_0x62_PlayerNames;
