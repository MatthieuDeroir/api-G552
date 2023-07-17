const nBytesToNumber = require("../Utils/nBytesToNumber");
const Tools = require("../Utils/Frame_Tools/Frame_Tools_index");
const eSport = require("../Utils/Enums/eSport");


/*
    * 0x33 : Basketball
 */

class Frame_0x33 {
    static build(_message) {
        return {
            InsertType: "DirectConsoleData",
            Sport: eSport.Basketball,

            Timer: {
                Value: Tools.Chrono(_message[4], _message[5], _message[6], _message[7]),
                Display: Tools.ClockTimerDisplay(_message[8]).Timer,
                Status: Tools.TimerStartStop(_message[20]).Status,
                LED: Tools.TimerStartStop(_message[20]).LED,
                Horn: Tools.Horn(_message[19]),
            },


            Timer24s: {
                Status: Tools.sTimerStartStop(_message[24]).Status,
                LED: Tools.sTimerStartStop(_message[24]).LED,
                Value: Tools.Chrono24s(nBytesToNumber(_message[48]), nBytesToNumber(_message[49])),
                Horn24s_Status: Tools.sHorn(_message[50]),
            },

            Period: nBytesToNumber(_message[11]),

            Home: {
                Points: nBytesToNumber(_message[9], _message[10]),
                Fouls: {
                    Team: Tools.B_TeamFouls(_message[15]).TeamFouls,
                    RS: Tools.B_TeamFouls(_message[15]).TeamFouls_RS,
                    Individual: Tools.IndividualFouls(22, 12, _message),
                },
                Possession: Tools.Possession(_message[3]).Home,
                TimeoutCounts: nBytesToNumber(_message[17]),
                Timeout: {
                    Count: nBytesToNumber(_message[17]),
                    Time: Tools.TimeOut(nBytesToNumber(_message[21]), nBytesToNumber(_message[46]), nBytesToNumber(_message[47])),
                }
            },

            Guest: {
                Points: nBytesToNumber(_message[12], _message[13]),
                Fouls: {
                    Team: Tools.B_TeamFouls(_message[16]).TeamFouls,
                    RS: Tools.B_TeamFouls(_message[16]).TeamFouls_RS,
                    Individual: Tools.IndividualFouls(34, 12, _message),
                },
                Possession: Tools.Possession(_message[3]).Guest,
                TimeoutCounts: nBytesToNumber(_message[18]),
                Timeout: {
                    Count: nBytesToNumber(_message[18]),
                    Time: Tools.TimeOut(nBytesToNumber(_message[21]), nBytesToNumber(_message[46]), nBytesToNumber(_message[47])),
                }
            }
        };
    }
}

module.exports = Frame_0x33;