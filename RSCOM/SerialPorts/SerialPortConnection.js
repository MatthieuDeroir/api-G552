const { SerialPort } = require('serialport');
const fs = require('fs');
const path = require('path');
const config = require('../../config');

const EventEmitter = require('events');

const sharedEmitter = new EventEmitter();


let AllDevices = [];
let Closing = false;

class SerialPortConnection {
    constructor() {
        console.log('Serial Port Initialization');
        this.currentCOMPorts = [];
        this.connection = null;
        this.currentCOMPortName = "";

        // Bind 'this' to class methods
        this.RefreshCurrentCOMPorts = this.RefreshCurrentCOMPorts.bind(this);
        this.TryConnectCOMPorts = this.TryConnectCOMPorts.bind(this);
        this.StartReading = this.StartReading.bind(this);
        this.StopReading = this.StopReading.bind(this);
    }
    StartReading() {
        Closing = false;
        this.RefreshCurrentCOMPorts();
        this.ConnectAvailablePorts();

        // Check for ports every 0.1 seconds
        setInterval(this.TryConnectCOMPorts, config.SerialPort.RefreshInterval);
    }

    StopReading() {
        Closing = true;
        AllDevices.forEach(device => {
            if (device.Started) {
                // Check if device.SerialPort exists before attempting to drain and close it
                if (device.SerialPort) {
                    device.Continue = false;
                    device.SerialPort.drain(() => {
                        device.SerialPort.close(() => {
                            device.SerialPort = null;
                            console.log(`Closed port ${device.DevicePortName}`);
                        });
                    });
                }
                else {
                    console.log(`Could not close port ${device.DevicePortName} because it is undefined.`);
                }
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
        let ports = fs.readdirSync(config.SerialPort.Path);

        ports.forEach(port => {
            // filter the elements to only get the serial ports
            if (port.startsWith(config.SerialPort.Filter)) {
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
                    baudRate: config.SerialPort.BaudRate,
                    dataBits: config.SerialPort.DataBits,
                    parity: config.SerialPort.Parity,
                    stopBits: config.SerialPort.StopBits,
                    flowControl: config.SerialPort.FlowControl,
                    readTimeout: config.SerialPort.ReadTimeout,
                    writeTimeout: config.SerialPort.WriteTimeout,
                    handshake: config.SerialPort.Handshake,
                    path: `${config.SerialPort.Path}/${device.DevicePortName}`
                };
                device.SerialPort = new SerialPort(options, (err) => {
                    if (err) {
                        console.log(`Error opening port: ${err.message}`);
                        device.Started = false;
                    } else {
                        console.log(`Port ${device.DevicePortName} open`);
                        device.SerialPort.on('data', data => {
                            try {
                                console.log(`Data received from ${device.DevicePortName} : ${data}`);
                                device.LastReadTime = new Date();
                                sharedEmitter.emit('data', data);
                            } catch (err) {
                                console.log(`Error handling data from ${device.DevicePortName}: ${err}`);
                            }
                        });
                        device.SerialPort.on('close', () => {
                            console.log(`${device.DevicePortName} is closed`);
                            device.Started = false;
                        });
                        device.SerialPort.on('error', (err) => {
                            console.log(`Error with port ${device.DevicePortName}: ${err}`);
                            device.Started = false;
                        });
                    }
                });

            }
        });
    }

}


module.exports = { SerialPortConnection, sharedEmitter };