const MacroController = require("../Controllers/macroController");
const unixSocketSetup = require("../Sockets/Unixsocket.js");

let previousMacrosDataMode = null;

/**
 * Handle the scoring data received from the RSCOM
 * @param scoring
 * @returns {Promise<void>}
 * @constructor handleScoring
 **/


const handleScoring = async (scoring) => {
    try {
        const macro = new MacroController();

        const immediateModes = [0, 1, 2, 16, 17, 18, 19, 20];
        const macroModes = [3, 4, 5, 6, 7, 8, 21];

        const handleImmediateMode = (mode) => {
            unixSocketSetup.sendData(scoring);
            previousMacrosDataMode = mode;
        };

        const handleMacroMode = async (mode) => {
            const macrosData = await macro.getMacrosByButton(mode);
            console.log("macrosData", macrosData)
            if (macrosData === 9){
                console.log("No event for this macro, sending Mode", scoring.Mode);
                scoring.Mode = 9;
                unixSocketSetup.sendData(scoring);
            }
            else if (macrosData && macrosData[0]) {
                macrosData[0].Mode = mode;
                previousMacrosDataMode = mode; // Update the cache
                unixSocketSetup.sendMedia(macrosData[0]);
            } else {
                console.log("No event for this macro, sending Mode", scoring.Mode);
                scoring.Mode = 9;
                unixSocketSetup.sendData(scoring);
            }
        };

        // console.log("Scoring Mode:", scoring.Mode);

        if (scoring.Mode === 9) {
            unixSocketSetup.sendData(scoring);
            previousMacrosDataMode = 9;
        } else if (immediateModes.includes(scoring.Mode)) {
            handleImmediateMode(scoring.Mode);
        } else if (macroModes.includes(scoring.Mode)) {
            await handleMacroMode(scoring.Mode);
        }

    } catch (error) {
        console.error("Error fetching macros:", error.message);
        scoring.Mode = 9;
        unixSocketSetup.sendData(scoring);
    }
};

module.exports = handleScoring;
