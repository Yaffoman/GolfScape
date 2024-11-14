<script>
    import { onMount } from "svelte";
    import { courseStore } from "../stores/courseStore";

    onMount(async () => {
        const {Map3DElement, Marker3DInteractiveElement} = await google.maps.importLibrary("maps3d");
        let Marker = Marker3DInteractiveElement;
        let mapObject = new Map3DElement({
            center: {lat: 37.36353, lng: -121.9286, altitude: 10000},
            tilt: 67.5,
            range: 100000000,
            defaultLabelsDisabled: true
        });
        document.getElementById('map_container')?.append(mapObject);
    })

    function flyToCourse(course) {
        mapObject.flyCameraTo({
            endCamera: {
                center: {lat: course.latitude, lng: course.longitude, altitude: 0},
                tilt: 67.5,
                range: 1000
            },
            durationMillis: 100
        });

        //     For each hole, add a marker
        if (Marker) {
            for (const hole in course.holes) {
                const holeData = course.holes[hole];
                if (holeData.latitude?.[0] && holeData.longitude?.[0]) {
                    console.log(holeData)
                    let holeMarker = new Marker({
                        position: {lat: holeData.latitude[0], lng: holeData.longitude[0]},
                        altitudeMode: 'RELATIVE_TO_GROUND',
                        label:  {
                            text: hole,            // Customize text
                            color: "blue",         // Customize color
                            fontWeight: "bold",    // Customize font weight
                            fontSize: "24px",      // Customize font size
                        },
                    })

                    holeMarker.addEventListener('gmp-click', (event) => {
                           selectAndFlyToHole(holeData);
                           MarkerList.forEach(marker => marker.setVisible(false));
                    });

                    mapObject.append(holeMarker);
                    MarkerList.push(holeMarker);
                }
            }
        }

    }


    function flyToHole(hole_number, step) {
        const hole = $courseStore.selectedHole;
        const midpoint = calculateMidpoint(hole.latitude[step], hole.longitude[step], hole.latitude[step + 1], hole.longitude[step + 1]);
        const distance = calculateDistance(hole.latitude[step], hole.longitude[step], midpoint.lat, midpoint.lng);
        const range = calculateRange(distance, 67.5);
        mapObject.flyCameraTo({
            endCamera: {
                center: {...midpoint, altitude: 30},
                heading: calculateHeading(hole.latitude[step], hole.longitude[step], hole.latitude[step+1], hole.longitude[step+1]),
                tilt: 67.5,
                range: range
            },
            durationMillis: 3000
        });
    }
</script>


<div id="map_container" class="h-[500px]"></div>
