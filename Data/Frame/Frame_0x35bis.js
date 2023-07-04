const nBytesToNumber = require('../Utils/nBytesToNumber');
const nBytesToTables = require('../Utils/nBytesToTables');
const LED = require("../Utils/Enums/eLED");
const Tools = require("../Utils/Frame_Tools/Frame_Tools_index");

/*
    * 0x35 : Boxe
 */

class Frame_0x35 {
    static build(_message) {
        const GSI = {
            insertType: 'DirectConsoleData',
        };

        //CHRONO
        GSI.Chrono = Tools.Chrono(_message[4], _message[5], _message[6], _message[7]);

        // HOME WARNINGS
        GSI.Home_Warnings = nBytesToNumber(_message[10]);

        // GUEST WARNINGS
        GSI.Guest_Warnings = nBytesToNumber(_message[13]);

        // PERIOD
        GSI.Period = nBytesToNumber(_message[14]);

        // HORN
        GSI.Horn = Tools.Horn(_message[19]);

        // Timer Start/Stop
        let Timer = Tools.TimerStartStop(_message[20]);
        GSI.Timer_Status = Timer.Status;
        GSI.Timer_LED = Timer.LED;

        return GSI;
    }
}

module.exports = Frame_0x35;
