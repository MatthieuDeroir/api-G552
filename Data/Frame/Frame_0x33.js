const nBytesToNumber = require("../Utils/nBytesToNumber");
const Tools = require("../Utils/Frame_Tools/Frame_Tools_index");
const eSport = require("../Utils/Enums/eSport");


/*
    * 0x33 : Basketball
 */

class Frame_0x33 {
    static build(_message) {
        let GSI = {
            InsertType: "DirectConsoleData",
            Sport: eSport.Basketball,
        }

        // Possession
        GSI.Possession = Tools.Possession(_message[3]);

        // Chrono
        GSI.Chrono = Tools.Chrono(_message[4], _message[5], _message[6], _message[7]);

        // Home Team Score
        GSI.Home_Points = nBytesToNumber(_message[8], _message[9], _message[10]);

        // Guest Team Score
        GSI.Guest_Points = nBytesToNumber(_message[11], _message[12], _message[13]);

        // Period Number
        GSI.Period = nBytesToNumber(_message[14]);


        // Home Team Fouls
        let Home = Tools.B_TeamFouls(_message[15]);
        GSI.Home_TeamFouls = Home.TeamFouls;
        GSI.Home_TeamFouls_RS = Home.TeamFouls_RS;

        // Guest Team Fouls
        let Guest = Tools.B_TeamFouls(_message[16]);
        GSI.Guest_TeamFouls = Guest.TeamFouls;
        GSI.Guest_TeamFouls_RS = Guest.TeamFouls_RS;

        // Home Team Timeout
        GSI.Home_CountTimeout = nBytesToNumber(_message[17]);

        // Guest Team Timeout
        GSI.Guest_CountTimeout = nBytesToNumber(_message[18]);

        // Horn
        GSI.Horn = Tools.Horn(_message[19]);

        // Timer Status
        let Timer = Tools.TimerStartStop(_message[20]);
        GSI.Timer_Status = Timer.Status;
        GSI.Timer_LED = Timer.LED;

        // Home Team Individual Fouls
        GSI.Home_IndividualFoul = Tools.IndividualFouls(22, 12, _message);

        // Guest Team Individual Fouls
        GSI.Guest_IndividualFoul = Tools.IndividualFouls(34, 12, _message);

        // Chrono TimeOut
        //TODO: why Digit1 is stored in 21th byte, but Digit2 and Digit3 are stored in 46th and 47th byte?
        GSI.Chrono_TimeOut_Digit1 = nBytesToNumber(_message[21]);
        GSI.Chrono_TimeOut_Digit2 = nBytesToNumber(_message[46]);
        GSI.Chrono_TimeOut_Digit3 = nBytesToNumber(_message[47]);

        // 24" timer
        GSI.Timer24s_Digit1 = nBytesToNumber(_message[48]);
        GSI.Timer24s_Digit2 = nBytesToNumber(_message[49]);

        GSI.Horn24s_Status = Tools.sHorn(_message[50]);

        let Timer24s = Tools.sTimerStartStop(_message[51]);
        GSI.Timer24s_Status = Timer24s.Status;
        GSI.Timer24s_LED = Timer24s.LED;

        let sDisplay = Tools.sDisplay(_message[52]);
        GSI.Display_Status = sDisplay.Status;
        GSI.Display_LED_Mode = sDisplay.LED;

        return GSI;
    }
}

module.exports = Frame_0x33;