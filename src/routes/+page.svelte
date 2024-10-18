<script>
    import data from '$lib/data.json';
    import { onMount } from 'svelte';

    const images = import.meta.glob('/src/lib/images/*.jpeg', { eager: true });
    let imageList = {};
    let mapObject = null;
    // Load the images and use their filenames as keys
    for (const path in images) {
        const fileName = path.split('/').pop().split('.')[0]; // Get the file name without extension
        imageList[fileName] = images[path];
    }
    let selectedCourse = null;
    let selectedHole = null;
    const courses = data.courses;

    let holes =  []
    function selectCourse(course) {
        selectedCourse = course;
        selectedHole = null;
        holes = Object.keys(courses[selectedCourse].holes)
        flyToCourse(course);
    }
    console.log(imageList)
    function selectHole(hole) {
        selectedHole = hole;
    }
    onMount(async () => {
        const { Map3DElement } = await google.maps.importLibrary("maps3d");
        const map = new Map3DElement({
            center: { lat: 37.36353, lng: -121.9286, altitude: 0 },
            tilt: 67.5,
            range: 1000
        });
        mapObject = map;
        document.getElementById('map_container')?.append(map);
        // 32.697162, -117.207596

        map.flyCameraTo({
            endCamera: {
                center: { lat: 32.697162, lng: -117.207596, altitude: 30 },
                tilt: 67.5,
                range: 1000
            },
            durationMillis: 5000
        });
    })
    function flyToCourse(course) {
        const courseData = courses[course];
        mapObject.flyCameraTo({
            endCamera: {
                center: { lat: courseData.latitude, lng: courseData.longitude, altitude: 30 },
                tilt: 67.5,
                range: 1000
            },
            durationMillis: 1000
        });

    //     For each hole, add a marker
        for (const hole in courseData.holes) {
            const holeData = courseData.holes[hole];
            mapObject.addMarker({
                position: { lat: holeData.latitude[0], lng: holeData.longitude[0], altitude: 30 },
                title: `Hole ${hole}`,
                description: `Par ${holeData.par}`,
                icon: 'https://maps.google.com/mapfiles/kml/paddle/blu-circle.png'
            });
        }
    }
    function flyToHole(hole_number, step) {
        const hole = courses[selectedCourse].holes[selectedHole];
        mapObject.flyCameraTo({
            endCamera: {
                center: { lat: hole.latitude[step], lng: hole.longitude[step], altitude: 30 },
                tilt: 67.5,
                range: 1000
            },
            durationMillis: 1000
        });
    }


</script>

<div class="min-h-screen bg-base-200 p-10">
    <div class="text-center">
        <h1 class="text-5xl font-bold">GolfScape</h1>
        <p class="py-6">Explore golf courses in 3D realism and take a virtual tour of your favorite courses.</p>
    </div>

    {#if !selectedCourse}
        <!-- Course Selection -->
        <div class="grid grid-cols-2">
            {#each Object.keys(courses) as course}
                <div class="card">
                    <figure>
                        <img height="400px" width="400px" src={imageList[courses[course].image].default} alt={course} class="rounded-3xl h-64">
                    </figure>
                    <div class="card-body items-center">
                        <button class="btn btn-primary w-fit" on:click={() => selectCourse(course)}>
                            {course}
                        </button>
                    </div>
                </div>

            {/each}
        </div>
    {:else if !selectedHole}
        <!-- Hole Selection -->
        <div class="text-center">
            <h2 class="text-3xl">Selected Course: {selectedCourse}</h2>
            <p class="py-4">Select a hole to continue:</p>
            <div class="grid grid-cols-6 gap-4">
                {#each holes as hole}
                    <button class="btn btn-secondary" on:click={() => selectHole(hole)}>
                        Hole {hole}
                    </button>
                {/each}
            </div>
        </div>
    {:else}
        <!-- Course Details Template -->
        <div class="text-center">
            <h2 class="text-3xl">Course: {selectedCourse}</h2>
            <p class="py-4">Hole {selectedHole}</p>
            <div class="card w-full bg-base-100 shadow-xl">
                <div class="card-body">
                    <h2 class="card-title">{selectedCourse} - Hole {selectedHole}</h2>
                    <p>Experience this hole in full 3D realism with GolfScape's detailed virtual tour.</p>
                </div>
            </div>
            <button class="btn btn-outline mt-6" on:click={() => (selectedCourse = null)}>
                Back to Courses
            </button>
        </div>
    {/if}
    <div id="map_container" class="h-96"></div>
</div>
