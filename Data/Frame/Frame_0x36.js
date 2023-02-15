const eSport = require('../Utils/Enums/eSport');
const nBytesToNumber = require("../Utils/nBytesToNumber");
const LED = require("../Utils/Enums/eLED");

/*
    * 0x36 : Volleyball
 */

class Frame_0x36 {
    static build(_message) {
        const GSI = {
            insertType: 'DirectConsoleData',
            Sport: eSport.Volleyball,
        };

        //CHRONO
        if (_message[7] === 0x20) {
            GSI.Chrono = nBytesToNumber(_message[4], _message[5]) + "." + nBytesToNumber(_message[6]);
        } else {
            GSI.Chrono = nBytesToNumber(_message[4], _message[5]) + ":" + nBytesToNumber(_message[6], _message[7]);
        }

        // Points
        GSI.Home_Points = nBytesToNumber(_message[9], _message[10]);
        GSI.Guest_Points = nBytesToNumber(_message[12], _message[13]);

        // Set
        GSI.Set = nBytesToNumber(_message[14]);

        // Set Won
        GSI.Home_SetsWon = nBytesToNumber(_message[15]);
        GSI.Guest_SetsWon = nBytesToNumber(_message[16]);

        // Count Timeout
        GSI.Home_CountTimeout = nBytesToNumber(_message[17]);
        GSI.Guest_CountTimeout = nBytesToNumber(_message[18]);

        // Horn
        GSI.Horn = _message[19] === 0x31;

        // Chrono Status
        if (_message[20] === 0x30) {
            GSI.Chrono_Status = true;
            GSI.LED = false;
        } else if (_message[20] === 0x31) {
            GSI.Chrono_Status = false;
            GSI.LED = false;
        } else if (_message[20] === 0x32) {
            GSI.Chrono_Status = false;
            GSI.LED = true;
            GSI.LED_Color = LED.eColor.Red;
        } else if (_message[20] === 0x33) {
            GSI.Chrono_Status = false;
            GSI.LED = true;
            GSI.LED_Color = LED.eColor.Yellow;
        }

        if (_message[21] === 0x31) {
            GSI.Clock_Display = true;
            GSI.Chrono_Display = false;
        } else {
            GSI.Clock_Display = false;
            GSI.Chrono_Display = true;
        }

        // Set Points
        GSI.Home_SetPoints = [
            nBytesToNumber(_message[22], _message[23]),
            nBytesToNumber(_message[26], _message[27]),
            nBytesToNumber(_message[30], _message[31]),
            nBytesToNumber(_message[34], _message[35]),
        ];
        GSI.Guest_SetPoints = [
            nBytesToNumber(_message[24], _message[25]),
            nBytesToNumber(_message[28], _message[29]),
            nBytesToNumber(_message[32], _message[33]),
            nBytesToNumber(_message[36], _message[37]),
        ];

        // Players index
        GSI.Home_PlayersIndex = new Array(6);
        GSI.Guest_PlayersIndex = new Array(6);

        for (let i = 0; i < 6; i++) {
            if (_message[38 + i] >= 0x30 && _message[38 + i] <= 0x3f) {
                GSI.Home_PlayersIndex[nBytesToNumber(_message[38 + i])] = true;
            }
            if (_message[44 + i] >= 0x30 && _message[44 + i] <= 0x3f) {
                GSI.Guest_PlayersIndex[nBytesToNumber(_message[44 + i])] = true;
            }
        }

        // Service
        if (_message[50] === 0x31) {
            GSI.Home_Service = 1;
            GSI.Guest_Service = 0;
        } else if (_message[50] === 0x32) {
            GSI.Home_Service = 2;
            GSI.Guest_Service = 0;
        } else if (_message[50] === 0x33) {
            GSI.Home_Service = 0;
            GSI.Guest_Service = 1;
        } else if (_message[50] === 0x34) {
            GSI.Home_Service = 0;
            GSI.Guest_Service = 2;
        } else {
            GSI.Home_Service = 0;
            GSI.Guest_Service = 0;
        }

        // WInner
        if (_message[51] === 0x31) {
            GSI.Home_Winner = true;
            GSI.Guest_Winner = false;
        } else if (_message[51] === 0x32) {
            GSI.Home_Winner = false;
            GSI.Guest_Winner = true;
        } else {
            GSI.Home_Winner = false;
            GSI.Guest_Winner = false;
        }
        // TODO: DID 19,20,21!
        // TODO : add clock_display and chrono_display to game_state
        return GSI;
    }

}

module.exports = Frame_0x36;