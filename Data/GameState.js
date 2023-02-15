const Frames = require('./Frame/Frame_index');

class GameState {
    constructor() {
    }

    Insert(GSI){

    }

    OnConsoleReceiveValidByteArray = (_message) => {
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
            case 0xA9:
                toInsert = Frames._0xA9.build(_message);
                break;
            case 0xAC:
                toInsert = Frames._0xAC.build(_message);
                break;
            case 0x9F:
                break;
            default:
                console.log("Unknown Frame: " + _message[1]);
                break;
        }
        this.Insert(toInsert);
    };

}