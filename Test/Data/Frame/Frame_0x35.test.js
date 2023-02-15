const assert = require('chai').assert;
const Frame_0x35 = require('../../../Data/Frame/Frame_0x35');

describe('Frame_0x35', () => {
    it('. Chrono', () => {
        const message = [
            0xF8, // Start byte
            0x35, // Sport type
            0x20, 0x20, // Reserved
            0x31, 0x32, 0x33, 0x20, // Chrono
            0x30, // Home Team fouls units
            0x30, 0x30, // Home Score
            0x30, // Guest Team fouls units
            0x30, 0x30, // Guest Score
            0x30, // Period number
            0x30, // Home Penalties in Progress
            0x30, // Guest Penalties in Progress
            0x30, // Home Timeouts
            0x30, // Guest Timeouts
            0x31, // Horn
            0x30, // Timer Start/Stop
            0x20, // Reserved
            0x30, 0x30, // 1st Home Exclusion Shirt Number
            0x30, 0x30, 0x30, // 1st Home Exclusion Timer
            0x30, 0x30, // 2nd Home Exclusion Shirt Number
            0x30, 0x30, 0x30, // 2nd Home Exclusion Timer
            0x30, 0x30, // 3rd Home Exclusion Shirt Number
            0x30, 0x30, 0x30, // 3rd Home Exclusion Timer
            0x30, 0x30, // 1st Guest Exclusion Shirt Number
            0x30, 0x30, 0x30, // 1st Guest Exclusion Timer
            0x30, 0x30, // 2nd Guest Exclusion Shirt Number
            0x30, 0x30, 0x30, // 2nd Guest Exclusion Timer
            0x30, 0x30, // 3rd Guest Exclusion Shirt Number
            0x30, 0x30, 0x30, // 3rd Guest Exclusion Timer
            0x20, // Reserved
            0x0D, // End byte
        ];

        const expectedGSI = {
            insertType: 'DirectConsoleData',
            Chrono: '12.3',
            Home_Team_Fouls: 0,
            Home_Points: 0,
            Guest_Team_Fouls: 0,
            Guest_Points: 0,
            Period: 0,
            Chrono_Status: true,
            Home_CountTimeout: 0,
            Guest_CountTimeout: 0,
            Home_Penalties: 0,
            Guest_Penalties: 0,
            Horn: true,
            LED: false,
            Home_ExclusionShirtNumber: [0, 0, 0],
            Guest_ExclusionShirtNumber: [0, 0, 0],
            Home_ExclusionTimer: [1000, 1000, 1000],
            Guest_ExclusionTimer: [1000, 1000, 1000]
        };

        const result = Frame_0x35.build(message);

        expect(result).toEqual(expectedGSI);
    });

    it(': Chrono', () => {
        const message = [
            0xF8, // Start byte
            0x35, // Sport type
            0x20, 0x20, // Reserved
            0x31, 0x32, 0x33, 0x31, // Chrono
            0x30, // Home Team fouls units
            0x30, 0x30, // Home Score
            0x30, // Guest Team fouls units
            0x30, 0x30, // Guest Score
            0x30, // Period number
            0x30, // Home Penalties in Progress
            0x30, // Guest Penalties in Progress
            0x30, // Home Timeouts
            0x30, // Guest Timeouts
            0x31, // Horn
            0x30, // Timer Start/Stop
            0x20, // Reserved
            0x30, 0x30, // 1st Home Exclusion Shirt Number
            0x30, 0x30, 0x30, // 1st Home Exclusion Timer
            0x30, 0x30, // 2nd Home Exclusion Shirt Number
            0x30, 0x30, 0x30, // 2nd Home Exclusion Timer
            0x30, 0x30, // 3rd Home Exclusion Shirt Number
            0x30, 0x30, 0x30, // 3rd Home Exclusion Timer
            0x30, 0x30, // 1st Guest Exclusion Shirt Number
            0x30, 0x30, 0x30, // 1st Guest Exclusion Timer
            0x30, 0x30, // 2nd Guest Exclusion Shirt Number
            0x30, 0x30, 0x30, // 2nd Guest Exclusion Timer
            0x30, 0x30, // 3rd Guest Exclusion Shirt Number
            0x30, 0x30, 0x30, // 3rd Guest Exclusion Timer
            0x20, // Reserved
            0x0D, // End byte
        ];

        const expectedGSI = {
            insertType: 'DirectConsoleData',
            Chrono: '12:31',
            Home_Team_Fouls: 0,
            Home_Points: 0,
            Guest_Team_Fouls: 0,
            Guest_Points: 0,
            Period: 0,
            Chrono_Status: true,
            Home_CountTimeout: 0,
            Guest_CountTimeout: 0,
            Home_Penalties: 0,
            Guest_Penalties: 0,
            Horn: true,
            LED: false,
            Home_ExclusionShirtNumber: [0, 0, 0],
            Guest_ExclusionShirtNumber: [0, 0, 0],
            Home_ExclusionTimer: [1000, 1000, 1000],
            Guest_ExclusionTimer: [1000, 1000, 1000]
        };

        const result = Frame_0x35.build(message);

        expect(result).toEqual(expectedGSI);
    });

    it('0x31 Timer', () => {
        const message = [
            0xF8, // Start byte
            0x35, // Sport type
            0x20, 0x20, // Reserved
            0x31, 0x32, 0x33, 0x20, // Chrono
            0x30, // Home Team fouls units
            0x30, 0x30, // Home Score
            0x30, // Guest Team fouls units
            0x30, 0x30, // Guest Score
            0x30, // Period number
            0x30, // Home Penalties in Progress
            0x30, // Guest Penalties in Progress
            0x30, // Home Timeouts
            0x30, // Guest Timeouts
            0x31, // Horn
            0x31, // Timer Start/Stop
            0x20, // Reserved
            0x30, 0x30, // 1st Home Exclusion Shirt Number
            0x30, 0x30, 0x30, // 1st Home Exclusion Timer
            0x30, 0x30, // 2nd Home Exclusion Shirt Number
            0x30, 0x30, 0x30, // 2nd Home Exclusion Timer
            0x30, 0x30, // 3rd Home Exclusion Shirt Number
            0x30, 0x30, 0x30, // 3rd Home Exclusion Timer
            0x30, 0x30, // 1st Guest Exclusion Shirt Number
            0x30, 0x30, 0x30, // 1st Guest Exclusion Timer
            0x30, 0x30, // 2nd Guest Exclusion Shirt Number
            0x30, 0x30, 0x30, // 2nd Guest Exclusion Timer
            0x30, 0x30, // 3rd Guest Exclusion Shirt Number
            0x30, 0x30, 0x30, // 3rd Guest Exclusion Timer
            0x20, // Reserved
            0x0D, // End byte
        ];

        const expectedGSI = {
            insertType: 'DirectConsoleData',
            Chrono: '12.3',
            Home_Team_Fouls: 0,
            Home_Points: 0,
            Guest_Team_Fouls: 0,
            Guest_Points: 0,
            Period: 0,
            Chrono_Status: false,
            Home_CountTimeout: 0,
            Guest_CountTimeout: 0,
            Home_Penalties: 0,
            Guest_Penalties: 0,
            Horn: true,
            LED: false,
            Home_ExclusionShirtNumber: [0, 0, 0],
            Guest_ExclusionShirtNumber: [0, 0, 0],
            Home_ExclusionTimer: [1000, 1000, 1000],
            Guest_ExclusionTimer: [1000, 1000, 1000]
        };

        const result = Frame_0x35.build(message);

        expect(result).toEqual(expectedGSI);
    });

    it('0x32 Timer', () => {
        const message = [
            0xF8, // Start byte
            0x35, // Sport type
            0x20, 0x20, // Reserved
            0x31, 0x32, 0x33, 0x20, // Chrono
            0x30, // Home Team fouls units
            0x30, 0x30, // Home Score
            0x30, // Guest Team fouls units
            0x30, 0x30, // Guest Score
            0x30, // Period number
            0x30, // Home Penalties in Progress
            0x30, // Guest Penalties in Progress
            0x30, // Home Timeouts
            0x30, // Guest Timeouts
            0x31, // Horn
            0x32, // Timer Start/Stop
            0x20, // Reserved
            0x30, 0x30, // 1st Home Exclusion Shirt Number
            0x30, 0x30, 0x30, // 1st Home Exclusion Timer
            0x30, 0x30, // 2nd Home Exclusion Shirt Number
            0x30, 0x30, 0x30, // 2nd Home Exclusion Timer
            0x30, 0x30, // 3rd Home Exclusion Shirt Number
            0x30, 0x30, 0x30, // 3rd Home Exclusion Timer
            0x30, 0x30, // 1st Guest Exclusion Shirt Number
            0x30, 0x30, 0x30, // 1st Guest Exclusion Timer
            0x30, 0x30, // 2nd Guest Exclusion Shirt Number
            0x30, 0x30, 0x30, // 2nd Guest Exclusion Timer
            0x30, 0x30, // 3rd Guest Exclusion Shirt Number
            0x30, 0x30, 0x30, // 3rd Guest Exclusion Timer
            0x20, // Reserved
            0x0D, // End byte
        ];

        const expectedGSI = {
            insertType: 'DirectConsoleData',
            Chrono: '12.3',
            Home_Team_Fouls: 0,
            Home_Points: 0,
            Guest_Team_Fouls: 0,
            Guest_Points: 0,
            Period: 0,
            Chrono_Status: false,
            Home_CountTimeout: 0,
            Guest_CountTimeout: 0,
            Home_Penalties: 0,
            Guest_Penalties: 0,
            Horn: true,
            LED: true,
            LED_Color: 'Red',
            Home_ExclusionShirtNumber: [0, 0, 0],
            Guest_ExclusionShirtNumber: [0, 0, 0],
            Home_ExclusionTimer: [1000, 1000, 1000],
            Guest_ExclusionTimer: [1000, 1000, 1000]
        };

        const result = Frame_0x35.build(message);

        expect(result).toEqual(expectedGSI);
    });

    it('0x33 Timer', () => {
        const message = [
            0xF8, // Start byte
            0x35, // Sport type
            0x20, 0x20, // Reserved
            0x31, 0x32, 0x33, 0x20, // Chrono
            0x30, // Home Team fouls units
            0x30, 0x30, // Home Score
            0x30, // Guest Team fouls units
            0x30, 0x30, // Guest Score
            0x30, // Period number
            0x30, // Home Penalties in Progress
            0x30, // Guest Penalties in Progress
            0x30, // Home Timeouts
            0x30, // Guest Timeouts
            0x31, // Horn
            0x33, // Timer Start/Stop
            0x20, // Reserved
            0x30, 0x30, // 1st Home Exclusion Shirt Number
            0x30, 0x30, 0x30, // 1st Home Exclusion Timer
            0x30, 0x30, // 2nd Home Exclusion Shirt Number
            0x30, 0x30, 0x30, // 2nd Home Exclusion Timer
            0x30, 0x30, // 3rd Home Exclusion Shirt Number
            0x30, 0x30, 0x30, // 3rd Home Exclusion Timer
            0x30, 0x30, // 1st Guest Exclusion Shirt Number
            0x30, 0x30, 0x30, // 1st Guest Exclusion Timer
            0x30, 0x30, // 2nd Guest Exclusion Shirt Number
            0x30, 0x30, 0x30, // 2nd Guest Exclusion Timer
            0x30, 0x30, // 3rd Guest Exclusion Shirt Number
            0x30, 0x30, 0x30, // 3rd Guest Exclusion Timer
            0x20, // Reserved
            0x0D, // End byte
        ];

        const expectedGSI = {
            insertType: 'DirectConsoleData',
            Chrono: '12.3',
            Home_Team_Fouls: 0,
            Home_Points: 0,
            Guest_Team_Fouls: 0,
            Guest_Points: 0,
            Period: 0,
            Chrono_Status: false,
            Home_CountTimeout: 0,
            Guest_CountTimeout: 0,
            Home_Penalties: 0,
            Guest_Penalties: 0,
            Horn: true,
            LED: true,
            LED_Color: 'Yellow',
            Home_ExclusionShirtNumber: [0, 0, 0],
            Guest_ExclusionShirtNumber: [0, 0, 0],
            Home_ExclusionTimer: [1000, 1000, 1000],
            Guest_ExclusionTimer: [1000, 1000, 1000]
        };

        const result = Frame_0x35.build(message);

        expect(result).toEqual(expectedGSI);
    });
});
