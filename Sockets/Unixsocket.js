// const net = require('net');
// const fs = require('fs');
// const sharedEmitter = require("../Utils/SharedEmitter");
// const socketPath = '/tmp/_sysmes.sock';
//
// // Check if the socket file already exists then delete it
//  if (fs.existsSync(socketPath)) {
//     fs.unlinkSync(socketPath);
// }
//
// function handleData(data) {
//     if (data.mode === 'scoring') {
//         // console.log('Handled score data');
//         // Do something with score data
//     } else if (data.mode === 'media') {
//         console.log('Received media data');
//         // Do something with media data
//     } else {
//         console.warn('Received unknown data mode:', data.mode);
//     }
// }
//
// const server = net.createServer((client) => {
//     // Define listener functions
//     function onScoring(data) {
//         try {
//             handleData(data);
//             if (data.mode === 'scoring') {
//                 client.write(JSON.stringify(data) + '\n');
//             } else if (data.mode === 'media') {
//                 client.write(JSON.stringify({ mode: 'diaporama', path: data.path, duration: data.duration }) + '\n');
//                 console.log('Sent gameState', data)
//             }
//         } catch (err) {
//             console.error('Failed to send score gameState', err);
//         }
//     }
//
//     function onMedia(data) {
//         try {
//             client.write(JSON.stringify(data) + '\n');
//         } catch (err) {
//             console.error('Failed to send media gameState', err);
//         }
//     }
//
//     // Attach listeners to sharedEmitter
//     sharedEmitter.on('scoring', onScoring);
//     sharedEmitter.on('media', onMedia);
//
//     client.on('close', () => {
//         console.log('Client disconnected');
//         // Remove listeners to avoid duplicates
//         sharedEmitter.removeListener('scoring', onScoring);
//         sharedEmitter.removeListener('media', onMedia);
//     });
//
//     client.on('data', (data) => {
//         try {
//             // console.log('Received raw gameState', data)
//             // console.log('Client on data Received gameState', data.toString())
//         } catch (err) {
//             console.error('Failed to parse JSON gameState', err);
//         }
//     });
//
//     client.on('error', (err) => {
//         console.error('Client error:', err);
//     });
// });
//
//
//
// let fetchMediaInterval;
// sharedEmitter.on('mode-updated', (data) => {
//     if (data.mode === 'diaporama') {
//         // Supposons que l'ID de l'événement est également passé dans data
//         const eventId = data.eventId;
//         const eventMedia = new EventMedia(); // Créez une instance de EventMedia pour appeler getAllByEvent
//         if(fetchMediaInterval) clearInterval(fetchMediaInterval); // Clear existing interval if any
//         fetchMediaInterval = setInterval(() => {
//             eventMedia.getAllByEvent(eventId)
//                 .then(medias => {
//                     console.log("Fetched medias:", medias);
//                     // Convertir les médias en JSON et les envoyer via le socket client
//                     try {
//                         client.write(JSON.stringify({ mode: 'diaporama', medias }) + '\n');
//                     } catch (err) {
//                         console.error('Failed to send media gameState', err);
//                     }
//                 })
//                 .catch(err => {
//                     console.error("Erreur lors de la récupération des médias par événement: ", err);
//                 });
//         }, 10000); // Remplacez 10000 par le temps souhaité en ms entre chaque fetch
//     }
//     else if (fetchMediaInterval) {
//         // Si le mode n'est pas diaporama, clear l'intervalle
//         clearInterval(fetchMediaInterval);
//     }
// });
//
// // Export the function to start the server
// module.exports = {
//     startServer: function () {
//         server.listen(socketPath, () => {
//             console.log(`UnixSocket Server listening on ${socketPath}`);
//         });
//     },
//     sendScoring: function (data) {
//         // console.log('UNIX Socket is sending data on data');
//         sharedEmitter.emit('scoring', data);
//     }
// }


const net = require('net');
const fs = require('fs');
const sharedEmitter = require("../Utils/SharedEmitter");
const socketPath = '/tmp/_sysmes.sock';


// Check if the socket file already exists then delete it
if (fs.existsSync(socketPath)) {
    fs.unlinkSync(socketPath);
}

function handleData(data) {

    if (data.mode === 9) {
        // Handle score data
        console.log('Handled score data')
    } else {
        // console.log('Received media data');
        // Handle media data
    }
}

let previousDataMode = null;

const server = net.createServer((client) => {

    function onDataReceived(data) {
        console.log("Mode", data.Mode)

        try {
            handleData(data);

            if (data?.Mode === 9) {
                client.write(JSON.stringify(data) + '\n');
                // console.log("Period", data.Period)
                // console.log("Timer", data.Timer.Value)
                // console.log("Home", data.Home.TeamName)
                // console.log("TimeOut", data.Home.Timeout.Count)
                // console.log("Points", data.Home.Points)
                // console.log("Guest", data.Guest.TeamName)
                // console.log("Points", data.Guest.Points)
                // console.log("TimeOut", data.Guest.Timeout.Count)

                // console.log('Sent score gameState', data)
            }else if (data?.Mode === 0 || data?.Mode === 1 || data?.Mode === 2 || data?.Mode === 16 || data?.Mode === 17 || data?.Mode === 18 || data?.Mode === 19 || data?.Mode === 20) {
                client.write(JSON.stringify(data) + '\n');
            }else if (data?.Mode !== previousDataMode && (data?.Mode === 3 || data?.Mode === 4 || data?.Mode === 5 || data?.Mode === 6 || data?.Mode === 7 || data?.Mode === 8)) {
                console.log("+")
                client.write(JSON.stringify(data) + '\n');
            }
        } catch (err) {
            console.error('Failed to send gameState', err);
        }
    }

    // Attach listeners to sharedEmitter
    sharedEmitter.on('data-received', onDataReceived);

    client.on('close', () => {
        console.log('Client disconnected');
        sharedEmitter.removeListener('data-received', onDataReceived);
    });

    client.on('scoring', (data) => {
        try {
            console.log('Received raw gameState', data)
            const parsedData = JSON.parse(data.toString());
            sharedEmitter.emit('data-received', parsedData);
        } catch (err) {
            console.error('Failed to parse JSON gameState', err);
        }
    });

    client.on('error', (err) => {
        console.error('Client error:', err);
    });

});

module.exports = {
    startServer: function () {
        server.listen(socketPath, () => {
            console.log(`UnixSocket Server listening on ${socketPath}`);
        });
    },
    sendData: function (data) {
        // console.log('UNIX Socket is sending scoring')
        sharedEmitter.emit('data-received', data);
    },
    sendMedia: function (data) {
        // console.log('UNIX Socket is sending media')
        sharedEmitter.emit('data-received', data);
    }
}
