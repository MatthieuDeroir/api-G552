const nBytesToNumber = require('../Utils/nBytesToNumber');
const LED = require("../Utils/Enums/eLED");
const Tools = require("../Utils/Frame_Tools/Frame_Tools_index");

/*
    * 0x37 : Basketball Guest Individual Points
 */

class Frame_0x37 {
    static build(_message) {
        const GSI = {
            InsertType: 'DirectControlData'
        };

        // Chrono
        GSI.Chrono = Tools.Chrono(_message[4], _message[5], _message[6], _message[7])

        // Guest Individual Points
        GSI.Guest_IndiviualPoints = Tools.IndividualPoints(_message);

        // Timer Status
        let Timer = Tools.sTimerStartStop(_message[20])
        GSI.Timer_Status = Timer.Status;
        GSI.Timer_LED = Timer.LED;

        // Clock Display / Chrono Display
        let Display = Tools.ClockTimerDisplay(_message[21]);
        GSI.Clock_Display = Display.Clock;
        GSI.Chrono_Display = Display.Chrono;

        // 24s timer digits
        GSI.Timer24s_Digit1 = nBytesToNumber(_message[48]);
        GSI.Timer24s_Digit2 = nBytesToNumber(_message[49]);

        // 24s Horn
        GSI.Horn24s_Status = Tools.Horn(_message[50]);

        // 24s Timer status and LEDs
        let sTimer = Tools.sTimerStartStop(_message[51]);
        GSI.Timer24s_Status = sTimer.Status;
        GSI.Timer24s_LED = sTimer.LED;

        // Display Status and LEDs
        let sDisplay = Tools.sDisplay(_message[52]);
        GSI.Display_Status = sDisplay.Status;
        GSI.Display_LED_Mode = sDisplay.LED;

        return GSI;
    }
}

module.exports = Frame_0x37;