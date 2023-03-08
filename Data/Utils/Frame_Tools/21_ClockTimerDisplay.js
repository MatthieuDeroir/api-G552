function ClockTimerDisplay(_message){
    let Display = {
        Clock: false,
        Chrono: false,
    }

    if (_message === 0x31) {
        Display.Clock = true;
    } else {
        Display.Chrono = true;
    }

    return Display;
}

module.exports = ClockTimerDisplay;