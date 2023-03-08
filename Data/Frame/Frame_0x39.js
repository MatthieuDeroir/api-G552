const nBytesToNumber = require('../Utils/nBytesToNumber');
const LED = require("../Utils/Enums/eLED");
const Tools = require("../Utils/Frame_Tools/Frame_Tools_index");

/*(
    * 0x39 : Tennis
 */

class Frame_0x39 {
    static build(_message) {
        const GSI = {
            insertType: 'DirectConsoleData',
        }

        // Chrono
        GSI.Chrono = Tools.Chrono(_message[4], _message[5], _message[6], _message[7])

        // Home Score
        GSI.Home_Points = nBytesToNumber(_message[9], _message[10]);

        // Guest Score
        GSI.Guest_Points = nBytesToNumber(_message[12], _message[13]);

        // Set won
        GSI.Home_SetsWon = nBytesToNumber(_message[15]);
        GSI.Guest_SetsWon = nBytesToNumber(_message[16]);

        // Chrono Status
        let Timer = Tools.sTimerStartStop(_message[20])
        GSI.Timer_Status = Timer.Status;
        GSI.Timer_LED = Timer.LED;

        // Clock Display / Chrono Display
        let Display = Tools.ClockTimerDisplay(_message[21]);
        GSI.Clock_Display = Display.Clock;
        GSI.Chrono_Display = Display.Chrono;

        // Home Points in set
        GSI.Home_PointsInSet = Tools.PointsInSet(24, 4, 4, _message);

        // Guest Points in set
        GSI.Guest_PointsInSet = Tools.PointsInSet(26, 4, 4, _message);

        // Service
        let Service = Tools.Service(_message[50]);
        GSI.Home_Service = Service.Home;
        GSI.Guest_Service = Service.Guest;

        // WInner
        let Winner = Tools.Winner(_message[51]);
        GSI.Home_Winner = Winner.Home;
        GSI.Guest_Winner = Winner.Guest;

        // Tie Break
        GSI.TieBreak = Tools.TieBreak(_message[52]);

        return GSI;
    }
}

module.exports = Frame_0x39;