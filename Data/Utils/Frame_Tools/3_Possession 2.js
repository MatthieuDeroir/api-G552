const eTeam = require("../../Utils/Enums/eTeam");

function Possession(_message) {
    if (_message === 0x31) {
        return eTeam.Home;
    }
    if (_message === 0x32) {
        return eTeam.Guest;
    }
    return eTeam.None;
}

module.exports = Possession;