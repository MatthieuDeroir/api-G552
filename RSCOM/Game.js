const Frames = require('./Frame/Frame_index');
const sharedEmitter = require('../Utils/SharedEmitter');
class Game {
    static State = {

        Sport: null,

        Period: null,

        Set: null,

        TieBreak: null,

        Timer: {
            Value: null,
            Display: null,
            Status: null,
            LED: null,
            Horn: null,
        },

        Timer24s: {
            Value: null,
            Display: null,
            Status: null,
            LED: null,
            Horn24s: null,
        },

        Clock: {
            Display: null,
        },

        Guest: {
            Player: {
                Name: new Array(16),
                Number: new Array(16),
            },
            PlayersInPlay: null,
            TeamName: null,
            Points: null,
            TotalPoints: null,
            PointsInSet: null,
            SetsWon: null,
            Service: null,
            Fouls: {
                Individual: new Array(16),
                Team: null,
                RS: null,
            },
            Timeout : {
                Count : null,
                Time : null,
            },
            PenaltiesInProgress: null,
            Exclusion: {
                Timer: null,
                ShirtNumber: null,
            },
            Possession: null,
            Warnings: null,
        },
        Home: {
            Player: {
                Name: new Array(16),
                Number: new Array(16),
            },
            PlayersInPlay: null,
            TeamName: null,
            Points: null,
            TotalPoints: null,
            PointsInSet: null,
            SetsWon: null,
            Service: null,
            Fouls: {
                Individual: new Array(16),
                Team: null,
                RS: null,
            },
            Timeout : {
                Count : null,
                Time : null,
            },
            PenaltiesInProgress: null,

            Exclusion: {
                Timer: null,
                ShirtNumber: null,
            },
            Possession: null,
            Warnings: null,
        }


    }

    static update = (_message) => {
        if (this.isValid(_message)) {
            this.select(_message);
        }
        else
            console.log('Invalid frame');
            return null;
    }

    static isValid(_message) {
        return _message[0] === 0xF8 && _message[53] === 0x0D;
    }

    static select = (_message) => {
        console.log("select method was called with _message: ", _message);
        let toInsert = null;
        switch (_message[1]) {
            case 0x3A:
                toInsert = Frames._0x3A.build(_message);
                break;
            case 0x3C:
                toInsert = Frames._0x3C.build(_message);
                break;
            case 0x6C:
                toInsert = Frames._0x6C.build(_message);
                break;
            case 0x9A:
                toInsert = Frames._0x9A.build(_message);
                break;
            case 0x33:
                toInsert = Frames._0x33.build(_message);
                break;
            case 0x35:
                toInsert = Frames._0x35.build(_message);
                break;
            case 0x36:
                toInsert = Frames._0x36.build(_message);
                break;
            case 0x37:
                toInsert = Frames._0x37.build(_message);
                break;
            case 0x38:
                toInsert = Frames._0x38.build(_message);
                break;
            case 0x39:
                toInsert = Frames._0x39.build(_message);
                break;
            case 0x62:
                if (_message[2] === 0x20 && _message[4] === 0x20 && _message[5] === 0x20)
                    toInsert = Frames._0x62_TeamNames.build(_message);
                else
                    toInsert = Frames._0x62_PlayerNames.build(_message);
                break;
            case 0x74:
                toInsert = Frames._0x74.build(_message);
                break;
            case 0x77:
                if (_message[2] === 0x20 && _message[4] === 0x20 && _message[5] === 0x20)
                    toInsert = Frames._0x77_TeamNames.build(_message);
                else
                    toInsert = Frames._0x77_PlayerNames.build(_message);
                break;
            case 0x93:
                toInsert = Frames._0x93.build(_message);
                break;
            case 0x94:
                toInsert = Frames._0x94.build(_message);
                break;
            case 0xA9:
                toInsert = Frames._0xA9.build(_message);
                break;
            case 0xAC:
                toInsert = Frames._0xAC.build(_message);
                break;
            case 0x9F:
                break;
            default:
                toInsert = "Unknown Frame: " + _message[1];
                console.log("Unknown Frame: " + _message[1]);
                break;
        }
        this.Insert(toInsert);
        this.Send();
    };

    static getState() {
        return this.State;
    }

    static Insert(GSI) {
        this.State = GSI;
    }

    static Send() {
        console.log(this.State);
        sharedEmitter.emit('scoring', this.State);
    }

}

module.exports = Game;