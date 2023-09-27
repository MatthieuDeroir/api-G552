const StringDecoder = require('string_decoder').StringDecoder;

function TeamName(startIndex, _message) {
    const UTF16 = new StringDecoder('utf16le');
    console.log(_message.slice(startIndex, startIndex + 18));

    return UTF16.write(Buffer.from(_message.slice(startIndex, startIndex + 18)));

}

module.exports = TeamName;