const SerialPort = require('serialport');

class SerialPortDevice {
    constructor() {
        this.DevicePortName = null;
        this.DeviceExists = true;
        this.Started = false;
        this.SerialPort = null;
        this.Continue = false;
        this.ReadTimeout = null;
        this.LastReadTime = null;
        this.LogCOMM = false;
        this.messageStarted = false;
        this.bufferIndex = 0;
        this.buffer = new Uint8Array(54);
    }

    InitThread() {
        this.Continue = true;

        this.SerialPort.open((error) => {
            if (error) {
                this.Continue = false;
                return console.error(error);
            }
            this.LastReadTime = Date.now();
            this.Read();
        });
    }

    Read() {
        if (!this.Continue || !this.SerialPort) {
            return;
        }

        this.SerialPort.read((error, data) => {
            if (error) {
                this.Continue = false;
                this.SerialPort.drain(() => {
                    this.SerialPort.close(() => {
                        this.SerialPort = null;
                        console.error(`Error reading from device ${this.DevicePortName}: ${error}`);
                    });
                });
                return;
            }

            if (data && data.length > 0) {
                this.LastReadTime = Date.now();
                for (let i = 0; i < data.length; i++) {
                    const receivedByte = data[i];
                    this.OnByteReceived(receivedByte);
                }
            }

            // Schedule next read after a delay
            this.ReadTimeout = setTimeout(() => {
                setImmediate(() => {
                    this.Read();
                });
            }, 10);
        });
    }

    OnByteReceived(_byte) {
        if (_byte === 0xF8) {
            this.messageStarted = true;

            this.bufferIndex = 0;
            this.buffer = new Uint8Array(64);
        }

        if (this.messageStarted) {
            this.buffer[this.bufferIndex] = _byte;
            this.bufferIndex++;

            if (_byte === 0x0D) {
                this.messageStarted = false;

                if (this.bufferIndex === 54) {
                    if (this.LogCOMM) {
                        const hex = this.buffer.slice(0, this.bufferIndex).toString('hex');
                        console.log(`Device ${this.DevicePortName} wrote a valid transmission of ${this.bufferIndex} bytes: ${hex}`);
                    }

                    // Send data to GameState (using setImmediate to handle asynchronous code)
                    setImmediate(() => {
                        UI.MainWindow.Ref?.OnReceiveByteArrayFromConsole(this.buffer);
                    });
                }

                // Reset buffer
                this.messageStarted = false;

                this.bufferIndex = 0;
                this.buffer = new Uint8Array(54);
            }
        }

        // Reset transmission if buffer index is 54 and not a "code fin"
        if (this.bufferIndex > 54) {
            this.messageStarted = false;

            this.bufferIndex = 0;
            this.buffer = new Uint8Array(54);
        }
    }
}
