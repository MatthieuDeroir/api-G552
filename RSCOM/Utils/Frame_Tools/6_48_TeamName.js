const iconv = require('iconv-lite');

function TeamName(startIndex, _message) {
    // Creation of a buffer from the message
    const buffer = Buffer.from(_message);

    // Slice the buffer from the specified start index to the specified size
    // the size is 18/2 because we want to slice 18 bytes, but the buffer is in utf16, so 2 bytes per character
    const slicedBuffer = buffer.slice(startIndex, startIndex + 9 * 2);

    // const slicedBuffer = buffer.slice(startIndex, startIndex + 18 * 2);

    // Decode using utf32le with iconv-lite
    // remove any character that is not a letter or a number or a letter with an accent or a space
    const decodedMessage = iconv.decode(slicedBuffer, 'utf16le').replace(/[^a-zA-Z0-9\u00C0-\u00FF ]/g, '');
    console.log('Decoded Message:' + decodedMessage);

    return decodedMessage;
}

module.exports = TeamName;


