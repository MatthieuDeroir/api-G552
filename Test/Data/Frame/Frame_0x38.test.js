const Frame_0x38 = require('../../../Data/Frame/Frame_0x38');

describe('Frame_0x38', () => {
    test('builds a valid object from message', () => {
        const message = [
            0xF8, // Start byte
            0x38, // Sport type
            0x20, 0x20, // Reserved
            0x31, 0x30, 0x30, 0x20, // Chrono
            0x20, 0x20, 0x20, // Reserved
            0x30, 0x30, // Individual Points Player 14
            0x30, 0x30, // Individual Points Player 15
            0x30, 0x30, // Individual Points Player 16
            0x20, 0x20, // Reserved
            0x30, // Horn
            0x30, // Timer Start/Stop
            0x30, // Clock/Timer Display
            0x30, 0x31, // Individual Points Player 1
            0x30, 0x30, // Individual Points Player 2
            0x30, 0x30, // Individual Points Player 3
            0x30, 0x30, // Individual Points Player 4
            0x30, 0x30, // Individual Points Player 5
            0x30, 0x30, // Individual Points Player 6
            0x30, 0x30, // Individual Points Player 7
            0x30, 0x30, // Individual Points Player 8
            0x30, 0x30, // Individual Points Player 9
            0x30, 0x30, // Individual Points Player 10
            0x30, 0x30, // Individual Points Player 11
            0x30, 0x30, // Individual Points Player 12
            0x30, 0x30, // Individual Points Player 13
            0x30, 0x30, // 24s Timer Digits
            0x31, // 24s Horm
            0x30, // 24s Timer Start/Stop
            0x30, // 24s Display
            0x0D, // End byte
        ];
        const expected = {
            InsertType: 'DirectControlData',
            Chrono: '10.0',
            Home_IndiviualPoints: [
                1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            ],
            Chrono_Status: true,
            LED: false,
            Clock_Display: false,
            Chrono_Display: true,
            Timer24s_Digit1: 0,
            Timer24s_Digit2: 0,
            Horn24s_Status: true,
            Timer24s_Status: true,
            Display_Status: false,
            Display_LED_Mode: 'Off',
        };
        const result = Frame_0x38.build(message);
        expect(result).toEqual(expected);
    });
});
