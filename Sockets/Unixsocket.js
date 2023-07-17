const net = require('net');
const fs = require('fs');
const sharedEmitter = require("../Utils/SharedEmitter");
const socketPath = '/tmp/_sysmes.sock';

// Check if the socket file already exists then delete it
if (fs.existsSync(socketPath)) {
    fs.unlinkSync(socketPath);
}

function handleData(data) {
    if (data.mode === 'scoring') {
        console.log('Handled score data :', data.gameState.chrono);
        // Do something with score data
    } else if (data.mode === 'media') {
        console.log('Received media data:', data.path, data.duration);
        // Do something with media data
    } else {
        console.warn('Received unknown data mode:', data.mode);
    }
}

const server = net.createServer((client) => {

    // Handle 'score' event
    sharedEmitter.on('scoring', (data) => {
        try {
            console.log('Received raw data:', data)
            const jsonData = JSON.parse(data);
            console.log('Parsed data to send :', jsonData);
            handleData(jsonData);
            if (jsonData.mode === 'scoring') {
                client.write(data + '\n');  // data is already a string
                console.log('Sent data:', jsonData)
            } else if (jsonData.mode === 'media') {
                client.write(JSON.stringify({ mode: 'media', path: jsonData.path, duration: jsonData.duration }) + '\n');
                console.log('Sent data:', jsonData)
            }
        } catch (err) {
            console.error('Failed to send score data:', err);
        }
    });


    // Handle 'media' event
    sharedEmitter.on('media', (data) => {
        try {
            client.write(JSON.stringify(data) + '\n');
        } catch (err) {
            console.error('Failed to send media data:', err);
        }
    });

    console.log('Client connected');

    client.on('end', () => {
        console.log('Client disconnected');
    });

    client.on('error', (err) => {
        console.error('Client error:', err);
    });
});

let mode = "media";
let sport = "basketball";

// Export the function to start the server
module.exports = {
    startServer: function () {
        server.listen(socketPath, () => {
            console.log(`UnixSocket Server listening on ${socketPath}`);
            let chrono = 0; // Initial chrono value
            if (mode === "scoring") {
                setInterval(() => {
                    chrono += 1; // Increment chrono by 0.1 every 100 milliseconds
                    const scoreData = {
                        mode: "scoring",
                        gameState: { chrono: chrono, sport: sport }, // Keep chrono to 1 decimal place
                    };
                    sharedEmitter.emit("scoring", JSON.stringify(scoreData));
                    console.log("RS scoring data : ", scoreData);
                }, 100);  // Increment and send score data every 0.1 seconds

            } else if (mode === "media") {
                setInterval(() => {
                    const mediaData = {
                        mode: 'media',
                        medias: [
                            // {
                            //     path: "/home/linaro/Server/Backend/Medias/1.png",
                            //     duration: 2,
                            //     type: "image"
                            // },
                            // {
                            //     path: "/home/linaro/Server/Backend/Medias/1.mp4",
                            //     duration: 3,
                            //     type: "video"
                            // },
                            // {
                            //     path: "/home/linaro/Server/Backend/Medias/2.mp4",
                            //     duration: 2,
                            //     type: "video"
                            // },
                            // {
                            //     path: "/home/linaro/Server/Backend/Medias/3.mp4",
                            //     duration: 3,
                            //     type: "video"
                            // }
                        ]
                    };
                    sharedEmitter.emit("media", mediaData);
                    console.log("Media data sent", mediaData);
                }, 100000);  // send media data every 5 seconds
            }
        });
        server.on('error', (err) => {
            console.error('Server error:', err);
        });
    }
}
