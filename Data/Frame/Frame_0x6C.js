const nBytesToNumber = require('../Utils/nBytesToNumber');
const LED = require("../Utils/Enums/eLED");

/*
    * 0x6C : Badminton
 */

class Frame_0x6C {
    static build(_message){

        const GSI = {
            insertType: 'DirectConsoleData',
        }

        // Chrono
        if (_message[7] === 0x20){
            GSI.Chrono = nBytesToNumber(_message[4], _message[5]) + '.' + nBytesToNumber(_message[6]);
        }
        else {
            GSI.Chrono = nBytesToNumber(_message[4], _message[5]) + ':' + nBytesToNumber(_message[6], _message[7]);
        }

        // Home Score
        GSI.Home_Points = nBytesToNumber(_message[9], _message[10]);

        // Gu est Score
        GSI.Guest_Points = nBytesToNumber(_message[12], _message[13]);

        // Set won
        GSI.Home_SetsWon = nBytesToNumber(_message[15]);
        GSI.Guest_SetsWon = nBytesToNumber(_message[16]);

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

        // Home Points in set
        GSI.Home_PointsInSet = new Array(3);

        for (let i = 0; i < 3; i++) {
            GSI.Home_PointsInSet[i] = nBytesToNumber(_message[24 + (i * 4)], _message[25 + (i * 4)]);
        }

        // Guest Points in set
        GSI.Guest_PointsInSet = new Array(3);

        for (let i = 0; i < 3; i++) {
            GSI.Guest_PointsInSet[i] = nBytesToNumber(_message[26 + (i * 4)], _message[27 + (i * 4)]);
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
        return GSI;
    }
}

module.exports = Frame_0x6C;