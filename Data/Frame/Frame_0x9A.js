const nBytesToNumber = require('../Utils/nBytesToNumber');
const LED = require("../Utils/Enums/eLED");
const Tools = require('../Utils/Frame_Tools/Frame_Tools_index');

/*
    * 0x9A : Simple Timer
 */

class Frame_0x9A {
    static build(_message){

        const GSI = {
            insertType: 'DirectConsoleData',
        }

        // Chrono
        GSI.Chrono = Tools.Chrono(_message[4], _message[5], _message[6], _message[7]);

        GSI.Horn = Tools.Horn(_message[19]);

        // Timer Status
        let Timer = Tools.TimerStartStop(_message[20]);
        GSI.Timer_Status = Timer.Status;
        GSI.LED = Timer.LED;

        // Clock Display / Chrono Display
        let Display = Tools.ClockTimerDisplay(_message[21]);
        GSI.Clock_Display = Display.Clock;
        GSI.Chrono_Display = Display.Chrono;

        return GSI;
    }
}

module.exports = Frame_0x9A;