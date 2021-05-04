const express = require('express');
const path = require('path');

const cors = require('cors');
const morgan = require('morgan');

const api = require('.routes/api');

const app = express();

app.use(cors({
    origin: 'http://localhost:3000'
}));
app.use(morgan('combined')) // Defaults to combined, but being explicit.

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public', 'build')))

app.use('/v1', api);

app.get('/*', (req,res) => {
    res.sendFile(path.join(__dirname, '..' ,'public', 'build', 'index.html'))
})

module.exports = app;
