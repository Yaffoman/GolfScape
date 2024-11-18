/**
 * point of interest (1= green, 2 = Green Bunker, 3 = Fairway Bunker, 4 = Water, 5 = Trees, 6 = 100 Marker, 7 = 150 Marker, 8 = 200 Marker, 9 = Dogleg, 10 = Road, 11 = Front tee, 12 = Back tee)
 * @type {{FAIRWAY: number, TEE: number, GREEN: number}}
 */
export const POI = {
    GREEN: 1,
    GREEN_BUNKER: 2,
    FAIRWAY_BUNKER: 3,
    WATER: 4,
    TREES: 5,
    ONE_HUNDRED_MARKER: 6,
    ONE_FIFTY_MARKER: 7,
    TWO_HUNDRED_MARKER: 8,
    DOGLEG: 9,
    ROAD: 10,
    FRONT_TEE: 11,
    BACK_TEE: 12
};

export const POI_PATH = [
    POI.BACK_TEE,
    POI.ONE_HUNDRED_MARKER,
    POI.GREEN
]
// import tpSouth from '../../../static/lib/tp south.json' with {type: "json"};
// import data from '../../../static/lib/data.json' with {type: "json"};
import fs from 'fs'

function parseAPIData() {
//load tp south data

    const tpSouthHoles = tpSouth.coordinates.reduce((acc, hole) => {
        console.log(acc, hole)
        if (!acc[hole.hole]) acc[hole.hole] = []
        acc[hole.hole].push({
            poi: hole.poi,
            center: hole.location === 2 && hole.sideFW === 2,
            latitude: hole.latitude,
            longitude: hole.longitude
        });
        return acc;
    }, {});
    // for each hole in data, add the hole data to the hole
    data.courses[0].holes.forEach((hole, index) => {
        hole.poi = tpSouthHoles[hole.hole]
    })
    fs.writeFileSync('data2.json', JSON.stringify(data), {flag: 'w'})
}

// parseAPIData()
