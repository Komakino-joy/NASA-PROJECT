const axios = require('axios');

const launches = require('./launches.mongo');
const planets = require('./planets.mongo');

const DEFAULT_FLIGHT_NUMBER = 100;



const SPACEX_API_URL = 'https://api.spacexdata.com/v4/launches/latest';

async function populateLaunches() {
try {
    console.log('Downloading launch data...');
    const response = await axios.post(SPACEX_API_URL, {
        query: {},
        options: {
            pagination: false,
            populate: [
                {
                    path: 'rocket',
                    select: {
                        "name": 1
                    }
                },
                {
                    path: "payloads",
                    select: {
                        'customers': 1
                    }
                }
            ]
        }
    })
    
    console.log('hellllllooooooooooooo', response)

    if (response.status != 200) {
        console.log('Problem downloading launch data');
        throw new Error('Launch data download failed.');
    };
} catch (error) {
  console.log('ERROR HAS OCCURED')  
}



const launchDocs = response.data.docs;

for ( const launchDoc of launchDocs){
    const payloads = launchDoc['payloads'];
    //convert customers into a single array of all customers
    const customers = payloads.flatMap((payload) => {
        return payload['customers'];
    });

    const launch = {
        flightNumber: launchDoc['flight_number'],
        mission: launchDoc['name'],
        rocket: launchDoc['rocket']['name'],
        launchDate: launchDoc['date_local'],
        upcoming: launchDoc['upcoming'],
        success: launchDoc['success'],
        customers,
    };
    console.log(`${launch.flightNumber} ${launch.mission}`);
    // populate launches collection
    await saveLaunch(launch);
}

};


async function loadLaunchData() {
// save us from making this fairly expensive query an unecessary amount of times. 
const firstLaunch = await findLaunch({
    flightNumber: 1,
    rocket: 'Falcon 1',
    mission: 'FalconSat',
});

if (firstLaunch) {
    console.log('Launch data already loaded!');
} else {
    await populateLaunches();
};
};

async function findLaunch(filter) {
return await launches.findOne(filter);
};

async function existsLaunchWithId(launchId) {
    return await findLaunch({
        flightNumber: launchId,
    });
};


async function getLatestFlightNumber() {
    const latestLaunch = await launches
    .findOne({})
    // sorting in descending order
    .sort('-flightNumber');

if (!latestLaunch) {
    return DEFAULT_FLIGHT_NUMBER;
}

    return latestLaunch.flightNumber;
};


async function getAllLaunches(skip, limit) {
    return await launches
    .find({}, { '_id': 0, '__v': 0, })
    .sort({ flightNumber: 1 })
    .skip(skip)
    .limit(limit);
};



async function saveLaunch(launch) {
// findOneAndUpdate will only return the props that we set in our request.
await launches.findOneAndUpdate({
    // Checking to see if flightNumber already exists.
    flightNumber: launch.flightNumber,
}, launch, {
    upsert: true,
});
};



async function scheduleNewLaunch(launch) {
// Checking if the selected planet exists
const planet = await planets.findOne({
    keplerName: launch.target,
});

if (!planet) {
    throw new Error('No Matching planet was found');
}


const newFlightNumber = await getLatestFlightNumber() + 1;

const newLaunch = Object.assign(launch, {
    success: true,
    upcoming: true,
    customers: ['Zero to Mastery', 'NASA'],
    flightNumber: newFlightNumber,
});

await saveLaunch(newLaunch);
};

async function abortLaunchById(launchId) {
const aborted = await launches.updateOne({
        flightNumber: launchId,
    }, {
        upcoming: false,
        success: false,
    });

    // return if only one document was updated
    return aborted.ok === 1 && aborted.nModified === 1;
};

module.exports = {
loadLaunchData,
existsLaunchWithId, 
getAllLaunches, 
scheduleNewLaunch,
abortLaunchById
};