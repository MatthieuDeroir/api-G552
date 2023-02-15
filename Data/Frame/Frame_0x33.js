const nBytesToNumber = require("../Utils/nBytesToNumber");

const eSport = require("../Utils/Enums/eSport");
const eTeam = require("../Utils/Enums/eTeam");
const LED = require("../Utils/Enums/eLED");

/*
    * 0x33 : Basketball
 */

class Frame_0x33 {
    static build(_message) {
        const ascii = new TextEncoder("ascii");
        const UTF16 = new TextEncoder("UTF-16");

        let GSI = {
            InsertType: "DirectConsoleData",
            Sport: eSport.Basketball,
        }

        // Possession
        if (_message[3] === 0x31) {
            GSI.Possession = eTeam.Home;
        } else if (_message[3] === 0x32) {
            GSI.Possession = eTeam.Guest;
        } else {
            //TODO: Clear possession when no team is selected
            GSI.Possession = eTeam.None;
        }

        // Chrono
        if (_message[7] === 0x20){
            GSI.Chrono = nBytesToNumber(_message[4], _message[5]) + "." + nBytesToNumber(_message[6]);
        } else {
            GSI.Chrono = nBytesToNumber(_message[4], _message[5]) + ":" + nBytesToNumber(_message[6], _message[7]);
        }

        // Home Team Score
        GSI.Home_Points = nBytesToNumber(_message[8], _message[9], _message[10]);

        // Guest Team Score
        GSI.Guest_Points = nBytesToNumber(_message[11], _message[12], _message[13]);

        // Period Number
        // TODO : why is it stored in string format in original code?
        if (_message[14] === 0x30) {
            GSI.Period = 0;
        } else {
            GSI.Period = nBytesToNumber(_message[14]);
        }

        // Home Team Fouls
        if (_message[15] === 0x52) {
            GSI.Home_TeamFouls = 8;
            GSI.Home_TeamFouls_RS = true;
        } else {
            GSI.Home_TeamFouls = nBytesToNumber(_message[15]);
            GSI.Home_TeamFouls_RS = false;
        }

        // Guest Team Fouls
        if (_message[16] === 0x52) {
            GSI.Guest_TeamFouls = 8;
            GSI.Guest_TeamFouls_RS = true;
        } else {
            GSI.Guest_TeamFouls = nBytesToNumber(_message[16]);
            GSI.Guest_TeamFouls_RS = false;
        }

        // Home Team Timeout
        GSI.Home_CountTimeout = nBytesToNumber(_message[17]);

        // Guest Team Timeout
        GSI.Guest_CountTimeout = nBytesToNumber(_message[18]);

        // Horn
        GSI.Horn = _message[19] === 0x31;

        // Chrono Status
        if (_message[20] === 0x30) {
            GSI.Chrono_Status = true;
            GSI.LED = false;
        }  else if (_message[20] === 0x31) {
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

        // Home Team Individual Fouls
        GSI.Home_IndividualFoul = new Array(12);

        // Guest Team Individual Fouls
        GSI.Guest_IndividualFoul = new Array(12);

        for (let i = 0; i < 12; i++) {
            GSI.Home_IndividualFoul[i] = nBytesToNumber(_message[22 + i]);
            GSI.Guest_IndividualFoul[i] = nBytesToNumber(_message[34 + i]);
        }

        // Chrono TimeOut
        //TODO: why Digit1 is stored in 21th byte, but Digit2 and Digit3 are stored in 46th and 47th byte?
        GSI.Chrono_TimeOut_Digit1 = nBytesToNumber(_message[21]);
        GSI.Chrono_TimeOut_Digit2 = nBytesToNumber(_message[46]);
        GSI.Chrono_TimeOut_Digit3 = nBytesToNumber(_message[47]);



        // Note 6 :  start/stop chronomètre	"31" --> stop + Pas de led strip fin des 24s
        // "32" --> stop + led strip fin des 24s rouge
        // (Mode Euroleague à partir du 13/08/2014) "33" --> stop + led strip fin des 24s jaunes
        // "30" --> start
        // Note 7 :  Affichage 24"  	"31" --> allumé + led strip fixe
        // "32" --> allumé + led strip clignotant
        // "30" --> éteint

        // 24" timer
        GSI.Timer24s_Digit1 = nBytesToNumber(_message[48]);
        GSI.Timer24s_Digit2 = nBytesToNumber(_message[49]);

        if (_message[50] !== 0x31) {
            GSI.Horn24s_Status = false;
        } else if (_message[50] === 0x31) {
            GSI.Horn24s_Status = true;
        }

        if (_message[51] === 0x30) {
            GSI.Timer24s_Status = true;
            GSI.LED = false;
        }   else if (_message[51] === 0x31) {
            GSI.Timer24s_Status = false;
            GSI.LED = false;
        } else if (_message[51] === 0x32) {
            GSI.Timer24s_Status = false;
            GSI.LED = true;
            GSI.LED_Color = LED.eColor.Red;
        } else if (_message[51] === 0x33) {
            GSI.Timer24s_Status = false;
            GSI.LED = true;
            GSI.LED_Color = LED.eColor.Yellow;
        }

        if (_message[52] === 0x30) {
            GSI.Display_Status = false;
            GSI.Display_LED_Mode = LED.eMode.Off;
        } else if (_message[52] === 0x31) {
            GSI.Display_Status = true;
            GSI.Display_LED_Mode = LED.eMode.Fix;
        } else if (_message[52] === 0x32) {
            GSI.Display_Status = true;
            GSI.Display_LED_Mode = LED.eMode.Blink;
        }

        return GSI;
    }
}

module.exports = Frame_0x33;