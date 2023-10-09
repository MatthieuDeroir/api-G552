const iconv = require('iconv-lite');
const Iconv = require('iconv').Iconv;

function TeamName(startIndex, _message) {
    // Creation of a buffer from the message
    const buffer = Buffer.from(_message);

    // Slice the buffer from the specified start index
    const slicedBuffer = buffer.slice(startIndex, startIndex + 18 * 4);

    // Decode using utf32le with iconv-lite
    const decodedMessage = iconv.decode(slicedBuffer, 'utf32le');

    const iconv = require('iconv-lite');

    // Check if utf32le is supported by iconv-lite
    console.log(iconv.encodingExists('utf32le'));


    console.log(decodedMessage);
    return decodedMessage;
}

module.exports = TeamName;
