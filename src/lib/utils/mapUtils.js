import {
    courseStore,
    selectHole,
    setFlyingThroughHole,
} from "../stores/courseStore";
import {POI, POI_PATH} from "../utils/dataUtils";
import {get} from "svelte/store";

function toRadians(degrees) {
    return degrees * (Math.PI / 180);
}

function toDegrees(radians) {
    return radians * (180 / Math.PI);
}

export function calculateHeading(latA, lonA, latB, lonB) {
    const latARad = toRadians(latA);
    const lonARad = toRadians(lonA);
    const latBRad = toRadians(latB);
    const lonBRad = toRadians(lonB);
    const dLon = lonBRad - lonARad;
    const y = Math.sin(dLon) * Math.cos(latBRad);
    const x =
        Math.cos(latARad) * Math.sin(latBRad) -
        Math.sin(latARad) * Math.cos(latBRad) * Math.cos(dLon);
    let heading = toDegrees(Math.atan2(y, x));
    return (heading + 360) % 360;
}

export function convertMetersToYards(meters) {
    return meters * 1.09361;

}

export function calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371000;
    const dLat = toRadians(lat2 - lat1);
    const dLng = toRadians(lng2 - lng1);
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(dLng / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

export function calculateRange(distance, tiltAngle = 67.5) {
    const tiltRadians = toRadians(tiltAngle);
    return distance / Math.cos(tiltRadians);
}

export function calculateMidpoint(lat1, lng1, lat2, lng2) {
    const dLon = toRadians(lng2 - lng1);
    const lat1Rad = toRadians(lat1);
    const lat2Rad = toRadians(lat2);
    const lon1Rad = toRadians(lng1);
    const Bx = Math.cos(lat2Rad) * Math.cos(dLon);
    const By = Math.cos(lat2Rad) * Math.sin(dLon);
    const lat3 = Math.atan2(
        Math.sin(lat1Rad) + Math.sin(lat2Rad),
        Math.sqrt((Math.cos(lat1Rad) + Bx) ** 2 + By ** 2)
    );
    const lon3 = lon1Rad + Math.atan2(By, Math.cos(lat1Rad) + Bx);
    return {lat: toDegrees(lat3), lng: toDegrees(lon3)};
}

export function flyToCourse(course) {
    const store = get(courseStore);
    const mapObject = store.mapObject;
    if (!mapObject) return;

    mapObject.flyCameraTo({
        endCamera: {
            center: {lat: course.latitude, lng: course.longitude, altitude: 0},
            tilt: 67.5,
            range: 1000,
        },
        durationMillis: 6000,
    });

    // Add markers for each hole
    if (window.google?.maps?.maps3d?.Marker3DInteractiveElement) {
        const Marker = window.google.maps.maps3d.Marker3DInteractiveElement;
        for (const holeData of course.holes) {
            if (holeData.latitude?.[0] && holeData.longitude?.[0]) {
                const {latitude, longitude} = holeData.poi.find((p) => {
                    return p.poi === POI.BACK_TEE;
                });
                let holeMarker = new Marker({
                    position: {lat: latitude, lng: longitude},
                    altitudeMode: "RELATIVE_TO_GROUND",
                    label: "Hole " + holeData.hole,
                });

                holeMarker.addEventListener("gmp-click", () => {
                    flyThroughHole(holeData);
                });

                mapObject.append(holeMarker);
            }
        }
    }
}

export async function flyToPoint(cameraOptions) {
    const store = get(courseStore);
    const mapObject = store.mapObject;
    if (!mapObject) return;

    await mapObject.flyCameraTo(cameraOptions);
    await new Promise((resolve) =>
        setTimeout(resolve, cameraOptions.durationMillis - 100)
    );
}

export async function flyThroughHole(hole) {
    const store = get(courseStore);
    if (store.flyingThroughHole) return;
    setFlyingThroughHole(true);
    const flagURL = "/flag.png"
    const bunkerURL = "/exclamation.png"
    const mapObject = store.mapObject;
    if (!mapObject) return;
    if (window.google?.maps?.maps3d?.Marker3DElement) {
        console.log(window.google.maps)
        const Marker = window.google.maps.maps3d.Marker3DElement;
        // TODO convert mt to yds
        const tee = hole.poi.find((p) => {
            return p.poi === POI.BACK_TEE;
        })
        hole.poi.forEach((poi) => {
            console.log(poi)
            const {latitude, longitude} = poi;
            let label = ""
            let icon = ""
            switch (poi.poi) {
                case POI.GREEN:
                    if (poi.center)
                        label = "Green";
                    icon = flagURL;
                    break;
                case POI.GREEN_BUNKER:
                    label = Math.round(convertMetersToYards(calculateDistance(tee.latitude, tee.longitude, latitude, longitude))) + " yds"
                    icon = bunkerURL;
                    break;
                case POI.FAIRWAY_BUNKER:
                    label = Math.round(convertMetersToYards(calculateDistance(tee.latitude, tee.longitude, latitude, longitude))) + " yds"
                    icon = bunkerURL;
                    break;
                case POI.FAIRWAY:
                    label = "Fairway";
                    break;
            }
            if (label === "" ) return;
            let holeMarker = new Marker({
                position: {lat: latitude, lng: longitude},
                altitudeMode: "RELATIVE_TO_GROUND",
                label: label,
            });
            if (icon !== "") {
                const flag = document.createElement('img');
                flag.src = icon;
                const temp = document.createElement('template');
                temp.content.append(flag);
                holeMarker.appendChild(temp);
            }
            mapObject.append(holeMarker);

        });
    }

    selectHole(hole);
    const duration = 3000;
    let heading = 0;
    let range = 200;
    const tilt = 67.5;
    const path = []
    const altitude = 80;
    POI_PATH.forEach((poi) => {
        const {longitude, latitude} = hole.poi.find((p) => {
            return p.poi === poi;
        }) || {longitude: null, latitude: null};
        if (!longitude || !latitude) return;
        path.push({longitude: longitude, latitude: latitude})
    });
    for (let step = 0; step < path.length - 1; step++) {
        const midpoint = calculateMidpoint(
            path[step].latitude,
            path[step].longitude,
            path[step + 1].latitude,
            path[step + 1].longitude
        );
        const distance = calculateDistance(
            path[step].latitude,
            path[step].longitude,
            midpoint.lat,
            midpoint.lng
        );
        range = calculateRange(distance, tilt);
        heading = calculateHeading(
            path[step].latitude,
            path[step].longitude,
            path[step + 1].latitude,
            path[step + 1].longitude
        );

        await flyToPoint({
            endCamera: {
                center: {...midpoint, altitude: altitude},
                heading: heading,
                tilt: tilt,
                range: range,
            },
            durationMillis: duration,
        });
    }

    await flyToPoint({
        endCamera: {
            center: {lng: path.at(-1).longitude, lat: path.at(-1).latitude, altitude: 150},
            heading: heading,
            tilt: tilt,
            range: 150,
        },
        durationMillis: duration,
    });

    mapObject.flyCameraAround({
        camera: {
            center: {
                lat: path.at(-1).latitude,
                lng: path.at(-1).longitude,
                altitude: 150,
            },
            range: 150,
            tilt: 35,
            heading: heading,
        },
        durationMillis: 6000,
        rounds: 1,
    });

    setFlyingThroughHole(false);
}


