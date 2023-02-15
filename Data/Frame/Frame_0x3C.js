const nBytesToNumber = require("../../Data/Utils/nBytesToNumber");
const eSport = require("../Utils/Enums/eSport");

/*
    * 0x3C : Handball
 */

class Frame_0x3C {
    static build(_message) {
        let GSI = {
            InsertType: "DirectConsoleData",
            Sport: eSport.Handball,
        };

        if (_message.slice(4, 8).includes(0x20)) {
            GSI.Chrono = nBytesToNumber(_message[4], _message[5]) + "." + nBytesToNumber(_message[6]);
        } else {
            GSI.Chrono = nBytesToNumber(_message[4], _message[5])  + ":" + nBytesToNumber(_message[6], _message[7]);

        }

        GSI.Horn = _message[19] === 0x31;

        GSI.Home_IndividualFoul = new Array(14);
        GSI.Guest_IndividualFoul = new Array(14);
        for (let i = 0; i < 14; i++) {
            GSI.Home_IndividualFoul[i] = nBytesToNumber(_message[22 + i]);
            GSI.Guest_IndividualFoul[i] = nBytesToNumber(_message[36 + i]);
        }

        return GSI;
    }
}

module.exports = Frame_0x3C;
