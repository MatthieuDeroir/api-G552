const express = require('express')
const db = require('./config/db');
const app = express()

const userRoutes = require('./routes/userRoutes');

app.use('/users', userRoutes);

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(3000, () => {
    console.log('Server started on http://localhost:3000')
})

