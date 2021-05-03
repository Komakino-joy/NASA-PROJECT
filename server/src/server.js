// Benefit of this is that now we can organize our
// code a little more by seperating th server functionality 
// that we have here, from the rest of our express code. 
// Which is now in a new file "app.js".
// Will be helpful with websockets. 
const http = require('http');

const app = require('./app');

const server = http.createServer(app);

const { loadPlanetsData } = require('./models/planets.model');

const PORT = process.env.PORT || 8000;

async function startServer() {
    await loadPlanetsData();

    server.listen(PORT, () => {
        console.log(`listening on port ${PORT}...`)
    });
};

startServer();



