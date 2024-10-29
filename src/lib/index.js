// place files you want to import through the `$lib` alias in this folder.
function toRadians(degrees) {
    return degrees * (Math.PI / 180);
}

function toDegrees(radians) {
    return radians * (180 / Math.PI);
}
export function calculateHeading(latA, lonA, latB, lonB) {
    // Convert latitudes and longitudes from degrees to radians
    const latARad = toRadians(latA);
    const lonARad = toRadians(lonA);
    const latBRad = toRadians(latB);
    const lonBRad = toRadians(lonB);

    // Calculate the difference in longitude
    const dLon = lonBRad - lonARad;

    // Calculate the bearing using the formula
    const y = Math.sin(dLon) * Math.cos(latBRad);
    const x = Math.cos(latARad) * Math.sin(latBRad) - Math.sin(latARad) * Math.cos(latBRad) * Math.cos(dLon);
    let heading = toDegrees(Math.atan2(y, x));

    // Normalize to 0 - 360 degrees
    heading = (heading + 360) % 360;

    return heading;
}
export function calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371000; // Earth radius in meters
    const dLat = toRadians(lat2 - lat1);
    const dLng = toRadians(lng2 - lng1);

    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLng / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
}

export function calculateRange(distance, tiltAngle = 67.5) {
    // Convert tilt to radians
    const tiltRadians = toRadians(tiltAngle);

    // Calculate the range needed to keep both points in the frame
    return distance / Math.cos(tiltRadians);
}

export function calculateMidpoint(lat1, lng1, lat2, lng2) {
    const dLon = toRadians(lng2 - lng1);

    // Convert lat/lng to radians
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

    return { lat: toDegrees(lat3), lng: toDegrees(lon3) };
}
