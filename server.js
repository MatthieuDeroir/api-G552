const express = require('express')
const db = require('./database/db');
const app = express()
const config = require('./config');

const userRoutes = require('./routes/userRoutes');
const mediaRoutes = require('./routes/mediaRoutes');
const eventmediaRoutes = require('./routes/eventmediaRoutes');
const fileRoutes = require('./routes/fileRoutes');
const eventRoutes = require('./routes/eventRoutes');

app.use('/users', userRoutes);
app.use('/files', fileRoutes);
app.use('/medias', mediaRoutes);
app.use('/events,', eventRoutes);
app.use('/eventmedias', eventmediaRoutes);

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(config.port, () => {
    console.log(`Server started on ${config.ip}:${config.port}`)
})

