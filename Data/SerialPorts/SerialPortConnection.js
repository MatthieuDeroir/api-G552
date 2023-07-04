const { SerialPort } = require('serialport');
const fs = require('fs');
const path = require('path');

let AllDevices = [];
let Closing = false;

class SerialPortConnection {
    constructor() {
        // console.log('Serial Port Initialization');
        // this.Init();
    }
    StartReading() {
        Closing = false;
        this.RefreshCurrentCOMPorts();
        this.ConnectAvailablePorts();

        // Check for ports every 0.1 seconds
        setInterval(this.TryConnectCOMPorts, 100);
    }

    StopReading() {
        Closing = true;
        AllDevices.forEach(device => {
            if (device.Started) {
                device.Continue = false;
                device.SerialPort.drain(() => {
                    device.SerialPort.close(() => {
                        device.SerialPort = null;
                        console.log(`Closed port ${device.DevicePortName}`);
                    });
                });
            }
        });
    }

    TryConnectCOMPorts() {
        if (!Closing) {
            this.RefreshCurrentCOMPorts();
            this.ConnectAvailablePorts();
        }
    }

    RefreshCurrentCOMPorts() {
        AllDevices.forEach(device => {
            device.DeviceExists = false;
        });

        let portnames = SerialPort.list();
        console.log(portnames);

        // get all the elements in the device directory
        let ports = fs.readdirSync('/dev');

        ports.forEach(port => {
            // filter the elements to only get the serial ports
            if (port.startsWith('tty')) {
                let PortName = port;
                let found = false;
                AllDevices.forEach(device => {
                    if (device.DevicePortName === PortName) {
                        device.DeviceExists = true;
                        found = true;
                    }
                });

                if (!found) {
                    let device = {
                        DeviceExists: true,
                        Started: false,
                        DevicePortName: PortName,
                        LastReadTime: new Date()
                    };
                    AllDevices.push(device);
                    console.log("Added new COM Device : " + device.DevicePortName);
                }
            }
        });

        AllDevices.forEach((device, index) => {
            if (!device.DeviceExists) {
                console.log("Removing COM Device : " + device.DevicePortName);
                AllDevices.splice(index, 1);
            }
        });
    }

    ConnectAvailablePorts() {
        AllDevices.forEach(device => {
            console.log(device);
            if (!device.Started && device.DeviceExists) {
                console.log("Connecting to : " + device.DevicePortName);
                device.Started = true;
                const options = {
                    baudRate: 9600,
                    dataBits: 8,
                    parity: 'none',
                    stopBits: 1,
                    flowControl: 'none',
                    handshake:'none',
                    path:`/dev/${device.DevicePortName}`
                };
                let port = new SerialPort(options, (err) => {
                    if (err) {
                        console.log(`Error opening port: ${err.message}`);
                        device.Started = false;
                    } else {
                        console.log(`Port ${device.DevicePortName} open`);
                        port.on('data', data => {
                            console.log(`Data received from ${device.DevicePortName} : ${data}`);
                            device.LastReadTime= new Date();
                        });
                        port.on('close', () => {
                            console.log(`${device.DevicePortName} is closed`);
                            device.Started = false;
                        });
                    }
                });
            }
        });
    }
}


module.exports = SerialPortConnection;