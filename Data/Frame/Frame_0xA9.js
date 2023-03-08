const nBytesToNumber = require('../Utils/nBytesToNumber');
const Tools = require('../Utils/Frame_Tools/Frame_Tools_index');
/*
    * 0xA9 : Home Shirt Numbers Summary
 */

class Frame_0xA9 {
    static build(_message) {
        const GSI = {
            insertType: 'DirectConsoleData',
        };

        // Home Player Number
        GSI.Home_PlayerNumber = Tools.ShirtNumber(4, 16, _message);

        return GSI;
    }
}

module.exports = Frame_0xA9;