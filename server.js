const express = require('express')
const db = require('./config/db');
const app = express()

const userRoutes = require('./routes/userRoutes');
const mediaRoutes = require('./routes/mediaRoutes');
const eventmediaRoutes = require('./routes/eventmediaRoutes');

app.use('/users', userRoutes);
app.use('/medias', mediaRoutes)
app.use('/eventmedias', eventmediaRoutes)

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(3000, () => {
    console.log('Server started on http://localhost:3000')
})

