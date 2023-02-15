function parseBytesToNumber(...numbers) {
    let num = 0;

    for (let n in numbers) {
        num += parseInt((numbers[n] - 0x30).toString()) * Math.pow(10, numbers.length - n - 1);
    }
    return num;
}

module.exports = parseBytesToNumber;