const {StringDecoder} = require('string_decoder');
const nBytesToNumber = require('../Utils/nBytesToNumber');

/*
    * 0x77 : Player Names and shirt numbers of the players
 */

// This class is used to process and build the 0x62 frame
class Frame_0x77_PlayerNames {
    // This static method is used to build the 0x62 frame
    static build(_message) {
        // Create a string decoder with UTF-16LE encoding
        const decoder = new StringDecoder('utf16le');

        // Initialize the GSI object
        const GSI = {
            // This property specifies the type of insert
            insertType: 'eGameStateInsertType.DirectConsoleData',
            // This property stores the player names
            guest_PlayerName: new Array(16),
            // This property stores the player numbers
            guest_PlayerNumber: new Array(16),
        };

        // Re-encode the _message by replacing 0x20 with 0x00
        const reEncodedMessage = _message.map((byte) => {
            if (byte === 0x20) {
                return 0x00;
            }
            return byte;
        });

        // Calculate the index of the player
        const indexPlayer = _message[2] - 0x30;
        // If the index of the player is valid, store the player's name and number in the GSI object
        if (indexPlayer >= 0 && indexPlayer < 16) {
            // Store the player's name in the GSI object
            GSI.guest_PlayerName[indexPlayer] = Buffer.from(reEncodedMessage.slice(3, 27)).toString('utf16le');

            // -3 means number 00
            if (reEncodedMessage[51] === 0x30 && reEncodedMessage[52] === 0x30) {
                GSI.guest_PlayerNumber[indexPlayer] = -3;
            }

            // -2 means number 0
            else if (reEncodedMessage[51] === 0x00 && reEncodedMessage[52] === 0x30) {
                GSI.guest_PlayerNumber[indexPlayer] = -2;
            } else {
                // Store the player's number in the GSI object
                GSI.guest_PlayerNumber[indexPlayer] = nBytesToNumber(reEncodedMessage[51], reEncodedMessage[52]);
            }
        }

        // Return the GSI object
        return GSI;
    }
}

// Export the Frame_0x62_PlayerNames class
module.exports = Frame_0x77_PlayerNames;
