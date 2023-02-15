
/*
    * 0x74 : Clear all
 */

class Frame_0x74 {
    static build(message) {
        const GSI = {
            InsertType: "DirectConsoleData",
            Home_TeamName: "",
            Guest_TeamName: "",
            Home_PlayerName: new Array(16),
            Guest_PlayerName: new Array(16),
        };

        for (let i = 0; i < 16; i++) {
            GSI.Home_PlayerName[i] = "";
            GSI.Guest_PlayerName[i] = "";
        }

        return GSI;
    }
}

module.exports = Frame_0x74;