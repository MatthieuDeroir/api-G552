const nBytesToNumber = require('../Utils/nBytesToNumber');
const LED = require("../Utils/Enums/eLED");

/*
    * 0x35 : Handball / Soccer / Boxe
 */

class Frame_0x35 {
    static build(_message) {
        const GSI = {
            insertType: 'DirectConsoleData',
        };

        //CHRONO

        if (_message[7] === 0x20) {
            GSI.Chrono = nBytesToNumber(_message[4], _message[5]) + "." + nBytesToNumber(_message[6]);
        } else {
            GSI.Chrono = nBytesToNumber(_message[4], _message[5]) + ":" + nBytesToNumber(_message[6], _message[7]);
        }

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

        // TODO: Penalties
        // HOME PENALTIES
        GSI.Home_Penalties = nBytesToNumber(_message[15]);

        // GUEST PENALTIES
        GSI.Guest_Penalties = nBytesToNumber(_message[16]);

        // HOME TIMEOUTS
        GSI.Home_CountTimeout = nBytesToNumber(_message[17]);

        // GUEST TIMEOUTS
        GSI.Guest_CountTimeout = nBytesToNumber(_message[18]);

        // HORN
        GSI.Horn = _message[19] === 0x31;

        // Timer Start/Stop
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

        // INDIVIDUAL FOULS
        GSI.Home_ExclusionShirtNumber = new Array(3);
        GSI.Guest_ExclusionShirtNumber = new Array(3);
        GSI.Home_ExclusionTimer = new Array(3);
        GSI.Guest_ExclusionTimer = new Array(3);

        for (let i = 0; i < 3; i++) {
            GSI.Home_ExclusionShirtNumber[i] = nBytesToNumber(_message[22 + 5 * i], _message[23 + 5 * i]);
            GSI.Home_ExclusionTimer[i] = nBytesToNumber(_message[24 + 5 * i], _message[25 + 5 * i], _message[26 + 5 * i]);
            GSI.Guest_ExclusionShirtNumber[i] = nBytesToNumber(_message[37 + 5 * i], _message[38 + 5 * i]);
            GSI.Guest_ExclusionTimer[i] = nBytesToNumber(_message[39 + 5 * i], _message[40 + 5 * i], _message[41 + 5 * i]);

            // exceptions for 10:00 exclusion timers
            if (_message[24 + 5 * i] === 0x30 && _message[25 + 5 * i] === 0x30 && _message[26 + 5 * i] === 0x30) {
                GSI.Home_ExclusionTimer[i] = 1000;
            }
            if (_message[39 + 5 * i] === 0x30 && _message[40 + 5 * i] === 0x30 && _message[41 + 5 * i] === 0x30) {
                GSI.Guest_ExclusionTimer[i] = 1000;
            }
        }
        return GSI;
    }
}

module.exports = Frame_0x35;