require('jest')
const assert = require('assert');
const Frame_0x77_TeamNames = require('../../RSCOM/Frame/Frame_0x77_TeamNames');

describe('Frame_0x77_TeamNames', function() {
    it('should return ALISTATEA GUESTBTEA', function() {
        const message = [
            0xF8, 0x77, 0x20, 0x20, 0x20, 0x20,
            0x41, 0x00, 0x4C, 0x00, 0x49, 0x00, 0x53, 0x00, 0x54, 0x00,
            0x41, 0x00, 0x54, 0x00, 0x45, 0x00, 0x41, 0x00,
            0x00, 0x00, 0x20, 0x20, 0x00, 0x00,
            0x47, 0x00, 0x55, 0x00, 0x45, 0x00, 0x53, 0x00, 0x54, 0x00,
            0x42, 0x00, 0x54, 0x00, 0x45, 0x00, 0x41, 0x00,
            0x20, 0x20, 0x20, 0x20, 0x20, 0x0D
        ];
        const expected = {
            insertType: 'DirectConsoleData',
            Home_TeamName: `ALISTATEA`,
            Guest_TeamName: 'GUESTBTEA',
        };
        const result = Frame_0x77_TeamNames.build(message);
        assert.deepStrictEqual(result, expected);
    });
    it('should return NULL', function () {
        const message = [
            0xF8, // Start byte
            0x62, // Sport definition
            0x20, 0x20, 0x20, 0x20, // Reserved
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, // Home Team Name
            0x00, 0x00,
            0x00, 0x00, // Reserved
            0x00, 0x00,
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, // Guest Team Name
            0x20, 0x20, 0x20, 0x20, 0x20, // Reserved
            0x0D // End byte
        ]
        const expected = {
            insertType: 'DirectConsoleData',
            Home_TeamName: `         `,
            Guest_TeamName: '         ',
        }
        const result = Frame_0x77_TeamNames.build(message);
        assert.deepStrictEqual(result, expected);
    });
});



