const Frame_0x36 = require('../../../Data/Frame/Frame_0x36');

describe('Frame_0x36', () => {
    it('should parse a valid message into a GSI object', () => {
        const message = [0x00, 0x36, 0x00, 0x06, 0x00, 0x00, 0x00, 0x20, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01, 0x01, 0x00, 0x00, 0x00, 0x00, 0x31, 0x30, 0x31, 0x30, 0x31, 0x30, 0x31, 0x30, 0x30, 0x30, 0x30, 0x30, 0x30, 0x30, 0x30, 0x30, 0x30, 0x30, 0x30, 0x30, 0x30, 0x30, 0x30, 0x30, 0x30, 0x30, 0x30, 0x30, 0x30, 0x30, 0x30, 0x30];
        const expectedGSI = {
            insertType: 'DirectConsoleData',
            Sport: 'Volleyball',
            Chrono: '0:00',
            Home_Points: 1,
            Guest_Points: 0,
            Set: 1,
            Home_SetsWon: 0,
            Guest_SetsWon: 0,
            Home_CountTimeout: 0,
            Guest_CountTimeout: 0,
            Horn: true,
            Chrono_Status: false,
            LED: false,
            Clock_Display: true,
            Chrono_Display: false,
            Home_SetPoints: [0, 0, 0, 0],
            Guest_SetPoints: [0, 0, 0, 0],
            Home_PlayersIndex: [undefined, true, true, true, true, true],
            Guest_PlayersIndex: [undefined, undefined, undefined, undefined, undefined, undefined],
            Home_Service: 1,
            Guest_Service: 0,
            Home_Winner: true,
            Guest_Winner: false
        };
        const actualGSI = Frame_0x36.build(message);
        expect(actualGSI).toEqual(expectedGSI);
    });
});
