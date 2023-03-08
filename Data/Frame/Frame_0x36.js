const eSport = require('../Utils/Enums/eSport');
const nBytesToNumber = require("../Utils/nBytesToNumber");
const nBytesToTables = require("../Utils/nBytesToTables");
const LED = require("../Utils/Enums/eLED");

const Tools = require("../Utils/Frame_Tools/Frame_Tools_index");

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
        GSI.Chrono = Tools.Chrono(_message[4], _message[5], _message[6], _message[7]);

        // Points
        GSI.Home_TotalPoints = nBytesToNumber(_message[9], _message[10]);
        GSI.Guest_TotalPoints = nBytesToNumber(_message[12], _message[13]);

        // Set
        GSI.Set = nBytesToNumber(_message[14]);

        // Set Won
        GSI.Home_SetsWon = nBytesToNumber(_message[15]);
        GSI.Guest_SetsWon = nBytesToNumber(_message[16]);

        // Count Timeout
        GSI.Home_CountTimeout = nBytesToNumber(_message[17]);
        GSI.Guest_CountTimeout = nBytesToNumber(_message[18]);

        // Horn
        GSI.Horn = Tools.Horn(_message[19]);

        // Timer Status
        let Timer = Tools.TimerStartStop(_message[20]);
        GSI.Timer_Status = Timer.Status;
        GSI.LED = Timer.LED;


        // Clock Display / Chrono Display
        let Display = Tools.ClockTimerDisplay(_message[21]);
        GSI.Clock_Display = Display.Clock;
        GSI.Chrono_Display = Display.Chrono;


        // Set Points
        GSI.Home_PointsBySet = nBytesToTables(22, 4, 4, _message);
        GSI.Guest_PointsBySet = nBytesToTables(26, 4, 4, _message);


        // Players in play
        let PlayersInPlay = Tools.PlayersInPlay(_message);
        GSI.Home_PlayersInPlay = PlayersInPlay.Home;
        GSI.Guest_PlayersInPlay = PlayersInPlay.Guest;


        // Service
        let Service = Tools.Service(_message[50]);
        GSI.Home_Service = Service.Home;
        GSI.Guest_Service = Service.Guest;

        // WInner
        let Winner = Tools.Winner(_message[51]);
        GSI.Home_Winner = Winner.Home;
        GSI.Guest_Winner = Winner.Guest;

        // TODO: DID 19,20,21!
        // TODO : add clock_display and chrono_display to game_state
        return GSI;
    }

}

module.exports = Frame_0x36;