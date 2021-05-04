const { getAllPlanets } = require('../../models/planets.model');

// return is used just to ensure the function stops executing.
async function httpGetAllPlanets(req, res) {
    return res.status(200).json(await getAllPlanets());
};

module.exports = {
    httpGetAllPlanets,
};