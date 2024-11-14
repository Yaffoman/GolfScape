<script>
    import {onMount} from 'svelte';
    import {courseStore, selectCourse, selectHole} from '../lib/stores/courseStore';
    import CourseOverview from '../lib/components/CourseOverview.svelte';
    import IntroSection from '../lib/components/IntroSection.svelte';
    import {calculateHeading, calculateRange, calculateDistance, calculateMidpoint} from '$lib';
    //   const parser = new DOMParser();

    let Marker = null;
    let MarkerList = [];
    const images = import.meta.glob('/src/lib/images/*.jpeg', {eager: true});
    let imageList = {};
    let mapObject = null;
    // Load the images and use their filenames as keys
    for (const path in images) {
        const fileName = path.split('/').pop().split('.')[0]; // Get the file name without extension
        imageList[fileName] = images[path];
    }

    function selectAndFlyToCourse(course) {
        selectCourse(course)
        flyToCourse(course);
    }

    function selectAndFlyToHole(hole) {
        selectHole(hole)
        flyToHole();
    }
    async function flyToPoint(cameraOptions){
        await mapObject.flyCameraTo(cameraOptions);
        await new Promise(resolve => setTimeout(resolve, cameraOptions.durationMillis - 100));
    }

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
    })

    function flyToCourse(course) {
        mapObject.flyCameraTo({
            endCamera: {
                center: {lat: course.latitude, lng: course.longitude, altitude: 0},
                tilt: 67.5,
                range: 1000
            },
            durationMillis: 3000
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
                        label: hole,
                    })

                    holeMarker.addEventListener('gmp-click', (event) => {
                        selectAndFlyToHole(holeData);
                        // MarkerList.forEach(marker => marker.setVisible(false));
                    });

                    mapObject.append(holeMarker);
                    MarkerList.push(holeMarker);
                }
            }
        }

    }


    async function flyToHole() {
        const duration = 3000;
        const hole = $courseStore.selectedHole;
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
    selectCourse($courseStore.courses[0])
    
</script>
<IntroSection/>
{#each $courseStore.courses as course}
   <CourseOverview course={course}/>
{/each}
