const Tools = require('../Utils/Frame_Tools/Frame_Tools_index');
const nBytesToNumber = require('../Utils/nBytesToNumber');

/*
    * 0x94 : Rink Hockey en mode faute équipe
 */

class Frame_0x94 {
    static build(_message) {
        const GSI = {
            insertType: 'DirectConsoleData',
        }

        // Chrono
        GSI.Chrono = Tools.Chrono(_message[4], _message[5], _message[6], _message[7]);

        // Home Team Fouls
        GSI.Home_Team_Fouls= Tools.TeamFouls(_message[2], _message[8]);

        // Guest Team Fouls
        GSI.Guest_Team_Fouls = Tools.TeamFouls(_message[3], _message[11]);

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

        // Home Exclusion
        let Exclusion = Tools.Exclusion(22, 5, 3, _message);
        GSI.Home_ExclusionShirtNumber = Exclusion.ShirtNumber;
        GSI.Home_ExclusionTimer = Exclusion.Timer;

        // Guest Exclusion
        Exclusion = Tools.Exclusion(37, 5, 3, _message);
        GSI.Guest_ExclusionShirtNumber = Exclusion.ShirtNumber;
        GSI.Guest_ExclusionTimer = Exclusion.Timer;

        return GSI;

    }
}

module.exports = Frame_0x94;