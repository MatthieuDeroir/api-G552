const StringDecoder = require('string_decoder').StringDecoder;

function TeamName(startIndex, _message) {
    const UTF16 = new StringDecoder('utf16le');
    return UTF16.write(Buffer.from(_message.slice(startIndex, startIndex + 18)));

    console.log(_message.slice(startIndex, startIndex + 18));
}

module.exports = TeamName;