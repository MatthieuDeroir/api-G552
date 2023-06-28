const net = require('net');
const fs = require('fs');
const socketPath = '/tmp/_sysmes.sock';

// Check if the socket file already exists then delete it
if (fs.existsSync(socketPath)) {
    fs.unlinkSync(socketPath);
}

const server = net.createServer((client) => {
    console.log('Client connected');

    client.on('end', () => {
        console.log('Client disconnected');
    });

    client.write('Hello from server!\r\n');
});

// Export the function to start the server
module.exports = {
    startServer: function() {
        server.listen(socketPath, () => {
            console.log(`UnixSocket Server listening on ${socketPath}`);
        });
        server.on('error', (err) => {
            console.error('Server error:', err);
        });
    }
}
