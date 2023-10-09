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
        // console.log('Handled score data');
        // Do something with score data
    } else if (data.mode === 'media') {
        console.log('Received media data');
        // Do something with media data
    } else {
        console.warn('Received unknown data mode:', data.mode);
    }
}

const server = net.createServer((client) => {
    // Define listener functions
    function onScoring(data) {
        try {
            handleData(data);
            if (data.mode === 'scoring') {
                client.write(JSON.stringify(data) + '\n');
            } else if (data.mode === 'media') {
                client.write(JSON.stringify({ mode: 'media', path: data.path, duration: data.duration }) + '\n');
                console.log('Sent data:', data)
            }
        } catch (err) {
            console.error('Failed to send score data:', err);
        }
    }

    function onMedia(data) {
        try {
            client.write(JSON.stringify(data) + '\n');
        } catch (err) {
            console.error('Failed to send media data:', err);
        }
    }

    // Attach listeners to sharedEmitter
    sharedEmitter.on('scoring', onScoring);
    sharedEmitter.on('media', onMedia);

    client.on('close', () => {
        console.log('Client disconnected');
        // Remove listeners to avoid duplicates
        sharedEmitter.removeListener('scoring', onScoring);
        sharedEmitter.removeListener('media', onMedia);
    });

    client.on('data', (data) => {
        try {
            // console.log('Received raw data:', data)
            // console.log('Client on data Received data:', data.toString())
        } catch (err) {
            console.error('Failed to parse JSON data:', err);
        }
    });

    client.on('error', (err) => {
        console.error('Client error:', err);
    });
});



let fetchMediaInterval;
sharedEmitter.on('mode-updated', (data) => {
    if (data.mode === 'diaporama') {
        // Supposons que l'ID de l'événement est également passé dans data
        const eventId = data.eventId;
        const eventMedia = new EventMedia(); // Créez une instance de EventMedia pour appeler getAllByEvent
        if(fetchMediaInterval) clearInterval(fetchMediaInterval); // Clear existing interval if any
        fetchMediaInterval = setInterval(() => {
            eventMedia.getAllByEvent(eventId)
                .then(medias => {
                    console.log("Fetched medias:", medias);
                    // Convertir les médias en JSON et les envoyer via le socket client
                    try {
                        client.write(JSON.stringify({ mode: 'diaporama', medias }) + '\n');
                    } catch (err) {
                        console.error('Failed to send media data:', err);
                    }
                })
                .catch(err => {
                    console.error("Erreur lors de la récupération des médias par événement: ", err);
                });
        }, 10000); // Remplacez 10000 par le temps souhaité en ms entre chaque fetch
    }
    else if (fetchMediaInterval) {
        // Si le mode n'est pas diaporama, clear l'intervalle
        clearInterval(fetchMediaInterval);
    }
});

// Export the function to start the server
module.exports = {
    startServer: function () {
        server.listen(socketPath, () => {
            console.log(`UnixSocket Server listening on ${socketPath}`);
        });
    },
    sendScoring: function (data) {
        // console.log('UNIX Socket is sending data on data');
        sharedEmitter.emit('scoring', data);
    }
}
