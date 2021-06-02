const mongoose = require('mongoose');

// Being explicit that the open event will only be triggered once. 
mongoose.connection.once('open', () => {
    console.log('MongoDB connection ready.');
});

mongoose.connection.on('error', (err) => {
    console.error(err);
});

async function mongoConnect() {
    mongoose.connect(process.env.MONGO_URL, {
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