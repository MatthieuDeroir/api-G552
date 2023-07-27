function nBytesToNumber(...bytes) {
    let num = 0;


    for (let b in bytes) {
        num += parseInt((bytes[b] - 0x30).toString()) * Math.pow(10, bytes.length - b - 1);
    }

    return num;
}


module.exports = nBytesToNumber;