const nBytesToNumber = require('../Utils/nBytesToNumber');
const nBytesToTables = require('../Utils/nBytesToTables');
const LED = require("../Utils/Enums/eLED");
const Tools = require("../Utils/Frame_Tools/Frame_Tools_index");

/*
    * 0x35 : Handball / Soccer / Boxe
 */

class Frame_0x35 {
    static build(_message) {
        const GSI = {
            insertType: 'DirectConsoleData',
        };

        //CHRONO
        GSI.Chrono = Tools.Chrono(_message[4], _message[5], _message[6], _message[7]);

        // HOME TEAM FOULS
        GSI.Home_Team_Fouls = nBytesToNumber(_message[8]);

        // HOME POINTS
        GSI.Home_Points = nBytesToNumber(_message[9], _message[10]);

        // GUEST TEAM FOULS
        GSI.Guest_Team_Fouls = nBytesToNumber(_message[11]);

        // GUEST POINTS
        GSI.Guest_Points = nBytesToNumber(_message[12], _message[13]);

        // PERIOD
        GSI.Period = nBytesToNumber(_message[14]);

        // HOME PENALTIES
        GSI.Home_PenaltiesInProgress = Tools.PenaltiesInProgress(_message[15]);

        // GUEST PENALTIES
        GSI.Guest_PenaltiesInProgress = Tools.PenaltiesInProgress(_message[16]);

        // HOME TIMEOUTS
        GSI.Home_TimeOuts = nBytesToNumber(_message[17]);

        // GUEST TIMEOUTS
        GSI.Guest_TimeOuts = nBytesToNumber(_message[18]);

        // HORN
        GSI.Horn = Tools.Horn(_message[19]);

        // Timer Start/Stop
        let Timer = Tools.TimerStartStop(_message[20]);
        GSI.Timer_Status = Timer.Status;
        GSI.Timer_LED = Timer.LED;

        // Exclusions
        let Home_Exclusion = Tools.Exclusion(22, 5, 3,_message);
        GSI.Home_ExclusionTimer = Home_Exclusion.Timer;
        GSI.Home_ExclusionShirtNumber = Home_Exclusion.ShirtNumber;

        let Guest_Exclusion = Tools.Exclusion(37, 5, 3, _message);
        GSI.Guest_ExclusionTimer = Guest_Exclusion.Timer;
        GSI.Guest_ExclusionShirtNumber = Guest_Exclusion.ShirtNumber;


        return GSI;
    }
}

module.exports = Frame_0x35;