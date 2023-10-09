const StringDecoder = require('string_decoder').StringDecoder;
const iconv = require('iconv-lite');

function TeamName(startIndex, _message) {
    // Création d'un buffer à partir du message
    const buffer = Buffer.from(_message);

    // Décodage en utf32le
    const decodedMessage = buffer.slice(startIndex, startIndex + 18 * 4).toString('utf32le');

    console.log(decodedMessage);
    return decodedMessage;
}

module.exports = TeamName;
