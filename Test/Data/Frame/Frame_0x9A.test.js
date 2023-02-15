const Frame_0x9A = require('../../../Data/Frame/Frame_0x9A');

describe('Frame_0x9A', () => {
    it('should build a valid GSI object for 0x9A message with Chrono Status 0x30', () => {
        const message = [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x20, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x31, 0x30, 0x31];
        const expectedGSI = {
            insertType: 'DirectConsoleData',
            Chrono: '0.0',
            Horn: false,
            Chrono_Status: true,
            LED: false,
            Clock_Display: false,
            Chrono_Display: true,
        };
        const actualGSI = Frame_0x9A.build(message);
        expect(actualGSI).toEqual(expectedGSI);
    });

});