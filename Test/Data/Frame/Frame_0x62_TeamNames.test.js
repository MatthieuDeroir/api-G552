require('jest')
const assert = require('assert');
const Frame_0x62_TeamNames = require('../../../Data/Frame/Frame_0x62_TeamNames');

describe('Frame_0x62_TeamNames', function() {
    it('should return ALISTATEA GUESTBTEA', function() {
        const message = [
            0xF8, 0x62, 0x20, 0x20, 0x20, 0x20,
            0x41, 0x00, 0x4C, 0x00, 0x49, 0x00, 0x53, 0x00, 0x54, 0x00,
            0x41, 0x00, 0x54, 0x00, 0x45, 0x00, 0x41, 0x00,
            0x41, 0x00, // 10 characters
            0x20, 0x20,
            0x00, 0x00,
            0x47, 0x00, 0x55, 0x00, 0x45, 0x00, 0x53, 0x00, 0x54, 0x00,
            0x42, 0x00, 0x54, 0x00, 0x45, 0x00, 0x41, 0x00,
            0x20, 0x20, 0x20, 0x20, 0x20, 0x0D
        ];
        const expected = {
            insertType: 'DirectConsoleData',
            homeTeamName: `ALISTATEA`,
            guestTeamName: 'GUESTBTEA',
        };
        const result = Frame_0x62_TeamNames.build(message);
        assert.deepStrictEqual(result, expected);
    });
    it('should return NULL', function () {
        const message = [
            0xF8, // Start byte
            0x62, // Sport definition
            0x20, 0x20, 0x20, 0x20, // Reserved
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, // Home Team Name each char is 2 bytes
            0x00, 0x00,
            0x00, 0x00, // Reserved
            0x00, 0x00,
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, // Guest Team Name each char is 2 bytes
            0x20, 0x20, 0x20, 0x20, 0x20, // Reserved
            0x0D // End byte
            ]
        const expected = {
            insertType: 'DirectConsoleData',
            homeTeamName: `         `,
            guestTeamName: '         ',
        }
        const result = Frame_0x62_TeamNames.build(message);
        assert.deepStrictEqual(result, expected);
    });
});



