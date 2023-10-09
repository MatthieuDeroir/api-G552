const iconv = require('iconv-lite');
const Iconv = require('iconv').Iconv;

function TeamName(startIndex, _message) {
    // Creation of a buffer from the message
    const buffer = Buffer.from(_message);

    // Slice the buffer from the specified start index
    const slicedBuffer = buffer.slice(startIndex, startIndex + 18 * 2);

    // Decode using utf32le with iconv-lite
    const decodedMessage = iconv.decode(slicedBuffer, 'utf16');
    console.log('Decoded Message:' + decodedMessage);

    return decodedMessage;
}

module.exports = TeamName;
