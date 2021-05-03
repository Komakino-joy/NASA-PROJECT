// Benefit of this is that now we can organize our
// code a little more by seperating th server functionality 
// that we have here, from the rest of our express code. 
// Which is now in a new file "app.js".
// Will be helpful with websockets. 
const http = require('http');
const mongoose = require('mongoose');

const app = require('./app');

const { loadPlanetsData } = require('./models/planets.model');

const PORT = 8000;

const MONGO_URL = 'mongodb+srv://nasa-api:djD8GHQgzqrXngxF@nasacluster.jnpnq.mongodb.net/nasa?retryWrites=true&w=majority';

const server = http.createServer(app);

// Being explicit that the open event will only be triggered once. 
mongoose.connection.once('open', () => {
    console.log('MongoDB connection ready.');
});

mongoose.connection.on('error', (err) => {
    console.error(err);
});

async function startServer() {
    await mongoose.connect(MONGO_URL, {
        // Pass these 4 parameters everytime to avoid deprecation warnings
        useNewUrlParser: true, // Determines how mongoose parses connection string
        useFindAndModify: false, // Disables outdated way of updating mongo data
        useCreateIndex: true, // uses new createIndex function
        useUnifiedTopology: true // Use the updated way of talking to clusters of Mongo databases
    });
    await loadPlanetsData();

    server.listen(PORT, () => {
        console.log(`listening on port ${PORT}...`)
    });
};

startServer();



