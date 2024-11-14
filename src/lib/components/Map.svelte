<script>
    import { onMount } from "svelte";
    import {courseStore, selectHole} from "../stores/courseStore";
    import {calculateDistance, calculateHeading, calculateMidpoint, calculateRange} from "$lib";
    let mapObject;
    let MarkerList = [];
    let Marker;
    onMount(async () => {
        const {Map3DElement, Marker3DInteractiveElement} = await google.maps.importLibrary("maps3d");
        Marker = Marker3DInteractiveElement;
        mapObject = new Map3DElement({
            center: {lat: 37.36353, lng: -121.9286, altitude: 10000},
            tilt: 67.5,
            range: 100000000,
            defaultLabelsDisabled: true
        });
        document.getElementById('map_container')?.append(mapObject);
        flyToCourse($courseStore.selectedCourse);
    })

    function flyToCourse(course) {
        mapObject.flyCameraTo({
            endCamera: {
                center: {lat: course.latitude, lng: course.longitude, altitude: 0},
                tilt: 67.5,
                range: 1000
            },
            durationMillis: 6000
        });

        //     For each hole, add a marker
        if (Marker) {
            for (const hole in course.holes) {
                const holeData = course.holes[hole];
                if (holeData.latitude?.[0] && holeData.longitude?.[0]) {
                    let holeMarker = new Marker({
                        position: {lat: holeData.latitude[0], lng: holeData.longitude[0]},
                        altitudeMode: 'RELATIVE_TO_GROUND',
                        label:  hole
                    })

                    holeMarker.addEventListener('gmp-click', (event) => {
                           flyToHole(holeData);
                    });

                    mapObject.append(holeMarker);
                    MarkerList.push(holeMarker);
                }
            }
        }

    }

    async function flyToPoint(cameraOptions){
        await mapObject.flyCameraTo(cameraOptions);
        await new Promise(resolve => setTimeout(resolve, cameraOptions.durationMillis - 100));
    }

    async function flyToHole(hole) {
        selectHole(hole)
        const duration = 3000;
        let heading = 0;
        let range = 200;
        const tilt = 67.5;
        for (let step = 0; step < hole.latitude.length - 1; step++) {
            const midpoint = calculateMidpoint(hole.latitude[step], hole.longitude[step], hole.latitude[step + 1], hole.longitude[step + 1]);
            const distance = calculateDistance(hole.latitude[step], hole.longitude[step], midpoint.lat, midpoint.lng);
            range = calculateRange(distance, tilt);
            heading = calculateHeading(hole.latitude[step], hole.longitude[step], hole.latitude[step + 1], hole.longitude[step + 1]);
            await flyToPoint({
                endCamera: {
                    center: {...midpoint, altitude: 150},
                    heading: heading,
                    tilt: tilt,
                    range: range - 150
                },
                durationMillis: duration
            });
        }
        await flyToPoint({
            endCamera: {
                center: {
                    lng: hole.longitude.at(-1),
                    lat: hole.latitude.at(-1),
                    altitude: 150
                },
                heading: heading,
                tilt: tilt,
                range: range - 150
            },
            durationMillis: duration
        });
        await flyToPoint({
            endCamera: {
                center: {
                    lng: hole.longitude.at(-1),
                    lat: hole.latitude.at(-1),
                    altitude: 150
                },
                heading: heading,
                tilt: tilt - 20,
                range: range - 150
            },
            durationMillis: 200
        });
        mapObject.flyCameraAround({
            camera: {
                center: {lat: hole.latitude.at(-1), lng: hole.longitude.at(-1), altitude: 150},
                range: range - 150,
                tilt: 35,
                heading: heading
            },
            durationMillis: 6000,
            rounds: 1
        });
    }
</script>

<div id="map_container" class="h-[500px] p-10 "></div>
