const { getAllPlanets } = require('../../models/planets.model');

// return is used just to ensure the function stops executing.
function httpGetAllPlanets(req, res) {
    return res.status(200).json(getAllPlanets());
};

module.exports = {
    httpGetAllPlanets,
};