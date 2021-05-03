const express = require('express');
const { 
    httpGetAllLaunches,
    httpAddNewLaunch,
    httpAbortLaunch
} = require('./launches.controller')

const launchesRouter = express.Router();

// Mounted '/launches' in app.js
launchesRouter.get('/', httpGetAllLaunches);
launchesRouter.post('/', httpAddNewLaunch);
launchesRouter.delete('/:id', httpAbortLaunch);

module.exports = launchesRouter;