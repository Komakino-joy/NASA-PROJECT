const mongoose = require('mongoose');

const MONGO_URL = 'mongodb+srv://nasa-api:djD8GHQgzqrXngxF@nasacluster.jnpnq.mongodb.net/nasa?retryWrites=true&w=majority';

// Being explicit that the open event will only be triggered once. 
mongoose.connection.once('open', () => {
    console.log('MongoDB connection ready.');
});

mongoose.connection.on('error', (err) => {
    console.error(err);
});

async function mongoConnect() {
    mongoose.connect(MONGO_URL, {
        // Pass these 4 parameters everytime to avoid deprecation warnings
        useNewUrlParser: true, // Determines how mongoose parses connection string
        useFindAndModify: false, // Disables outdated way of updating mongo data
        useCreateIndex: true, // uses new createIndex function
        useUnifiedTopology: true // Use the updated way of talking to clusters of Mongo databases
    });
};

async function mongoDisconnect(){
    await mongoose.disconnect();
}

module.exports = {
    mongoConnect,
    mongoDisconnect
};