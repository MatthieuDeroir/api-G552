const nBytesToNumber = require('../Utils/nBytesToNumber');
const LED = require("../Utils/Enums/eLED");

/*
    * 0x37 : Basketball Guest Individual Points
 */

class Frame_0x37 {
    static build(_message) {
        const GSI = {
            InsertType: 'DirectControlData'
        };

        // Chrono

        if (_message.slice(4, 8).includes(0x20)) {
            GSI.Chrono = nBytesToNumber(_message[4], _message[5]) + "." + nBytesToNumber(_message[6]);
        } else {
            GSI.Chrono = nBytesToNumber(_message[4], _message[5]) + ":" + nBytesToNumber(_message[6], _message[7]);
        }

        // Guest Individual Points

        GSI.Guest_IndiviualPoints = new Array(16);

        // G14, G15, G16
        GSI.Guest_IndiviualPoints[13] = nBytesToNumber(_message[11], _message[12]);
        GSI.Guest_IndiviualPoints[14] = nBytesToNumber(_message[13], _message[14]);
        GSI.Guest_IndiviualPoints[15] = nBytesToNumber(_message[15], _message[16]);

        // G1, G2, G3, G4, G5, G6, G7, G8, G9, G10, G11, G12, G13
        for (let i = 0; i < 13; i++) {
            GSI.Guest_IndiviualPoints[i] = nBytesToNumber(_message[22 + i], _message[23 + i]);
        }

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

        // 24s timer
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
        } else if (_message[51] === 0x31) {
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

module.exports = Frame_0x37;