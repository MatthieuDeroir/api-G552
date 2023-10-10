const nBytesToNumber = require('../Utils/nBytesToNumber');
const LED = require("../Utils/Enums/eLED");
const Tools = require("../Utils/Frame_Tools/Frame_Tools_index");
const eSport = require("../Utils/Enums/eSport");

/*(
    * 0x39 : Tennis
 */

class Frame_0x39 {
    static build(_message) {
        return {
            Mode: nBytesToNumber(_message[2]),
            insertType: 'DirectConsoleData',
            Sport: eSport.Tennis,

            Timer: {
                Value: Tools.Chrono(_message[4], _message[5], _message[6], _message[7]),
                Status: Tools.TimerStartStop(_message[20]).Status,
                Display: Tools.ClockTimerDisplay(_message[21]).Timer,
                LED: Tools.TimerStartStop(_message[20]).LED,
                Horn: Tools.Horn(_message[19]),
            },

            Clock: {
                Display: Tools.ClockTimerDisplay(_message[21]).Clock,
            },

            Home: {
                Points: nBytesToNumber(_message[9], _message[10]),
                SetsWon: nBytesToNumber(_message[15]),
                Service: Tools.Service(_message[50]).Home,
                Winner: Tools.Winner(_message[51]).Home,
                PointsInSet: Tools.PointsInSet(22, 4, 4, _message),
            },
            Guest: {
                Points: nBytesToNumber(_message[12], _message[13]),
                SetsWon: nBytesToNumber(_message[16]),
                Service: Tools.Service(_message[50]).Guest,
                Winner: Tools.Winner(_message[51]).Guest,
                PointsInSet: Tools.PointsInSet(24, 4, 4, _message),
            },

            TieBreak: Tools.TieBreak(_message[52]),

        }
    }
}

module.exports = Frame_0x39;