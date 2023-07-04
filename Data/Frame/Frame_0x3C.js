const eSport = require("../Utils/Enums/eSport");
const Tools = require("../Utils/Frame_Tools/Frame_Tools_index");

/*
    * 0x3C : Handball Specific
 */

class Frame_0x3C {
    static build(_message) {
        let GSI = {
            InsertType: "DirectConsoleData",
            Sport: eSport.Handball,
        };

        GSI.Chrono = Tools.Chrono(_message[4], _message[5], _message[6], _message[7]);

        GSI.Horn = Tools.Horn(_message[19]);

        GSI.Home_IndividualFoul = Tools.IndividualFouls(22, 14, _message);
        GSI.Guest_IndividualFoul = Tools.IndividualFouls(36, 14, _message);

        return GSI;
    }
}

module.exports = Frame_0x3C;
