const nBytesToNumber = require('../Utils/nBytesToNumber');
const LED = require("../Utils/Enums/eLED");

/*
    * 0x9A : Simple Timer
 */

class Frame_0x9A {
    static build(_message){

        const GSI = {
            insertType: 'DirectConsoleData',
        }

        if (_message[7] === 0x20){
            GSI.Chrono = nBytesToNumber(_message[4], _message[5]) + '.' + nBytesToNumber(_message[6]);
        }
        else {
            GSI.Chrono = nBytesToNumber(_message[4], _message[5]) + ':' + nBytesToNumber(_message[6], _message[7]);
        }

        GSI.Horn = _message[19] === 0x31;

        // Chrono Status
        if (_message[20] === 0x30) {
            GSI.Chrono_Status = true;
            GSI.LED = false;
        } else if (_message[20] === 0x31) {
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

        if (_message[21] === 0x31) {
            GSI.Clock_Display = true;
            GSI.Chrono_Display = false;
        } else {
            GSI.Clock_Display = false;
            GSI.Chrono_Display = true;
        }

        return GSI;
    }
}

module.exports = Frame_0x9A;