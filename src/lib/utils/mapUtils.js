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

function hideHoleMarkers() {
    document.querySelectorAll('gmp-marker-3d-interactive').forEach((marker) => {
        // remove all markers that are not interactive (holes)
        marker.remove();
    });
}

async function addHoleMarkers(mapObject) {
    const course = get(courseStore).selectedCourse;
    if (!course) return;

    // Add markers for each hole
    if (window.google?.maps?.maps3d?.Marker3DInteractiveElement) {
        const Marker = window.google.maps.maps3d.Marker3DInteractiveElement;
        const {PinElement} = await window.google.maps.importLibrary("marker");
        for (const holeData of course.holes) {
            const latitude = holeData.poi.find((p) => p.poi === POI.BACK_TEE)?.latitude;
            const longitude = holeData.poi.find((p) => p.poi === POI.BACK_TEE)?.longitude;
            if (latitude && longitude) {
                let holeMarker = new Marker({
                    position: {lat: latitude, lng: longitude},
                    altitudeMode: "RELATIVE_TO_GROUND",
                    label: "Hole " + holeData.hole,
                });

                holeMarker.addEventListener("gmp-click", () => {
                    flyThroughHole(holeData);
                });
                const pinScaled = new PinElement({
                    scale: 0.75,
                    background: "#A9A9A9",
                    borderColor: "#A9A9A9",
                    glyphColor: "white",
                })
                holeMarker.append(pinScaled);
                mapObject.append(holeMarker);
            }
        }
    }
}

export async function flyToCourse(course) {
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

    addHoleMarkers(mapObject);
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

async function buildMarker(lat, lng, altitude, tee, color, distance = true, label = '') {
    const Marker = window.google.maps.maps3d.Marker3DElement;
    const {PinElement} = await window.google.maps.importLibrary("marker");

    let markerOptions = {
        position: {lat, lng, altitude},
        altitudeMode: "RELATIVE_TO_GROUND",
        extruded: false,
        label: '',
    };
    if (!tee) {
        markerOptions.label = "Fairway"
        return new Marker(markerOptions);
    }
    const pinScaled = new PinElement({
        scale: 0.5,
        glyphColor: "white",
    })

    markerOptions.label = distance ? Math.round(convertMetersToYards(calculateDistance(tee.latitude, tee.longitude, lat, lng))) + " yds" : label
    markerOptions.position.altitude = 5;
    markerOptions.extruded = true;
    pinScaled.background = color;
    pinScaled.borderColor = color;
    let holeMarker = new Marker(markerOptions);
    holeMarker.append(pinScaled);
    return holeMarker;
}

function removeMarkers() {
    document.querySelectorAll('gmp-marker-3d').forEach((marker) => {
        // remove all markers that are not interactive (holes)
        marker.remove();
    });
}

export async function flyThroughHole(hole) {
    const store = get(courseStore);
    if (store.flyingThroughHole) return;
    setFlyingThroughHole(true);
    const mapObject = store.mapObject;
    const course = store.selectedCourse;
    if (!mapObject) return;
    if (window.google?.maps?.maps3d?.Marker3DElement) {
        const tee = hole.poi.find((p) => {
            return p.poi === POI.BACK_TEE;
        })
        removeMarkers(mapObject, store.holeMarkers);
        hideHoleMarkers();
        for (const poi of hole.poi) {
            const {latitude, longitude} = poi;
            let newMarker = null;
            switch (poi.poi) {
                case POI.BACK_TEE:
                    newMarker = await buildMarker(latitude, longitude, 0, tee, "#A9A9A9", false, `${hole.hole}`);
                    break;
                case POI.GREEN:
                    if (poi.center) {
                        newMarker = await buildMarker(latitude, longitude, 5, tee, "#008000");
                    }
                    break;
                case POI.GREEN_BUNKER:
                case POI.FAIRWAY_BUNKER:
                    newMarker = await buildMarker(latitude, longitude, 10, tee, "#F5DEB3");
                    break;
                case POI.WATER:
                    newMarker = await buildMarker(latitude, longitude, 10, tee, "#0000FF");
                    break;
                case POI.FAIRWAY:
                    newMarker = await buildMarker(latitude, longitude);
                    break;
            }
            if (newMarker) {
                mapObject.append(newMarker);
            }
        }
    }

    selectHole(hole);
    const duration = 5000;
    let heading = 0;
    let range = 50;
    const tilt = 67.5;
    const altitudeOffset = course.altitude;
    const holeAltitude = hole.altitude ?? 0;
    const path = []
    const altitude = 60;
    POI_PATH.forEach((poi) => {
        const {longitude, latitude} = hole.poi.find((p) => {
            return p.poi === poi && (p.poi === POI.GREEN ? p.center : true);
        }) || {longitude: null, latitude: null};
        if (!longitude || !latitude) return;
        path.push({poi, longitude, latitude})
    });

    const point1 = path.find((p) => p.poi === POI.BACK_TEE);
    const point2 = path.find((p) => p.poi === POI.ONE_HUNDRED_MARKER);
    const point3 = path.find((p) => p.poi === POI.GREEN);

    console.log(point1, point2, point3)

    heading = point2 ? calculateHeading(point1.latitude, point1.longitude, point2.latitude, point2.longitude) : calculateHeading(point1.latitude, point1.longitude, point3.latitude, point3.longitude);
    await flyToPoint({
        endCamera: {
            center: {lng: point1.longitude, lat: point1.latitude, altitude: 50 + altitudeOffset + holeAltitude},
            heading: heading,
            tilt: 80,
            range: 50,
        },
        durationMillis: 4000,
    });

    if (point2) {
        heading = calculateHeading(point2.latitude, point2.longitude, point3.latitude, point3.longitude);
        await flyToPoint({
            endCamera: {
                center: {lng: point2.longitude, lat: point2.latitude, altitude: 50 + altitudeOffset + holeAltitude},
                heading: heading,
                tilt: 67.5,
                range: 50,
            },
            durationMillis: 4000,
        });
        await new Promise(resolve => setTimeout(resolve, 500));
    }

    await flyToPoint({
        endCamera: {
            center: {
                lng: point3.longitude,
                lat: point3.latitude,
                altitude: 80 + altitudeOffset + holeAltitude
            },
            heading: heading,
            tilt: 0,
            range: 50,
        },
        durationMillis: 4000,
    });

    // mapObject.flyCameraAround({
    //     camera: {
    //         center: {
    //             lat: point3.latitude,
    //             lng: point3.longitude,
    //             altitude: 80 + altitudeOffset + holeAltitude,
    //         },
    //         range: 20,
    //         tilt: 20,
    //         heading: heading,
    //     },
    //     durationMillis: 4500,
    //     rounds: 1,
    // });

    await new Promise((resolve) => setTimeout(resolve, 500));
    addHoleMarkers(mapObject);
    setFlyingThroughHole(false);
}


