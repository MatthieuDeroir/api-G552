const Frames = require('./Frame/Frame_index');

class GameState {
    constructor() {
        let toInsert = null;
    }

    static update = (_message) => {


        switch (_message[1]) {
            case 0x3A:
                this.toInsert = Frames._0x3A.build(_message);
                break;
            case 0x3C:
                this.toInsert = Frames._0x3C.build(_message);
                break;
            case 0x6C:
                this.toInsert = Frames._0x6C.build(_message);
                break;
            case 0x9A:
                this.toInsert = Frames._0x9A.build(_message);
                break;
            case 0x33:
                this.toInsert = Frames._0x33.build(_message);
                break;
            case 0x35:
                this.toInsert = Frames._0x35.build(_message);
                break;
            case 0x36:
                this.toInsert = Frames._0x36.build(_message);
                break;
            case 0x37:
                this.toInsert = Frames._0x37.build(_message);
                break;
            case 0x38:
                this.toInsert = Frames._0x38.build(_message);
                break;
            case 0x39:
                this.toInsert = Frames._0x39.build(_message);
                break;
            case 0x62:
                if (_message[2] === 0x20 && _message[4] === 0x20 && _message[5] === 0x20)
                    this.toInsert = Frames._0x62_TeamNames.build(_message);
                else
                    this.toInsert = Frames._0x62_PlayerNames.build(_message);
                break;
            case 0x74:
                this.toInsert = Frames._0x74.build(_message);
                break;
            case 0x77:
                if (_message[2] === 0x20 && _message[4] === 0x20 && _message[5] === 0x20)
                    this.toInsert = Frames._0x77_TeamNames.build(_message);
                else
                    this.toInsert = Frames._0x77_PlayerNames.build(_message);
                break;
            case 0x93:
                this.toInsert = Frames._0x93.build(_message);
                break;
            case 0x94:
                this.toInsert = Frames._0x94.build(_message);
                break;
            case 0xA9:
                this.toInsert = Frames._0xA9.build(_message);
                break;
            case 0xAC:
                this.toInsert = Frames._0xAC.build(_message);
                break;
            case 0x9F:
                break;
            default:
                this.toInsert = "Unknown Frame: " + _message[1];
                console.log("Unknown Frame: " + _message[1]);
                break;
        }
    };

    static getState(){
        return this.toInsert;
    }

    Insert(GSI) {

    }

}

module.exports = GameState;