const Tools = require('../Utils/Frame_Tools/Frame_Tools_index');
const nBytesToNumber = require('../Utils/nBytesToNumber');

/*
    * 0x93 : Handball
 */

class Frame_0x93 {
    static build(_message) {
        const GSI = {
            insertType: 'DirectConsoleData',
        }

        // Chrono
        GSI.Chrono = Tools.Chrono(_message[4], _message[5], _message[6], _message[7]);

        // Home Points
        GSI.Home_Points = nBytesToNumber(_message[9], _message[10])

        // Guest Points
        GSI.Guest_Points = nBytesToNumber(_message[12], _message[13])

        // Period
        GSI.Period = nBytesToNumber(_message[14]);

        //Penalties in progress
        GSI.Home_PenaltiesInProgress = Tools.PenaltiesInProgress(_message[15]);
        GSI.Guest_PenaltiesInProgress = Tools.PenaltiesInProgress(_message[16]);

        // Time out Number
        GSI.Home_TimeOuts = nBytesToNumber(_message[17]);
        GSI.Guest_TimeOuts = nBytesToNumber(_message[18]);

        // Horn
        GSI.Horn = Tools.Horn(_message[19]);

        // Timer Status
        let Timer = Tools.TimerStartStop(_message[20]);
        GSI.Timer_LED = Timer.LED;
        GSI.Timer_Status = Timer.Status;

        // Penalties Timer
        GSI.Home_PenaltiesTimer = Tools.PenaltiesTimer(22, 3, 3, _message);
        GSI.Guest_PenaltiesTimer = Tools.PenaltiesTimer(35, 3, 3, _message);


        return GSI;
    }
}

module.exports = Frame_0x93;