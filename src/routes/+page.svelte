<script>
    import {onMount} from 'svelte';
  import { courseStore, selectCourse, selectHole } from '../lib/stores/courseStore';
  import CourseOverview from '../lib/components/CourseOverview.svelte';
  import IntroSection from '../lib/components/IntroSection.svelte';
    // const parser = new DOMParser();

    let Marker = null;
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

    console.log(imageList)

    function selectAndFlyToHole(hole) {
        selectHole(hole)
        flyToHole(hole, 0);
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
                center: {lat: course.latitude, lng: course.longitude, altitude: 30},
                tilt: 67.5,
                range: 1000
            },
            durationMillis: 10000
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
                    })
                    // const pinSvgString = '<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="32" height="32" viewBox="0 0 32 32">\n' +
                    //     '<path d="M 9 4 C 7.346 4 6 5.346 6 7 C 6 8.3016094 6.8387486 9.4021391 8 9.8164062 L 8 11.304688 L 8 23.207031 L 8 27.023438 C 8 27.563438 8.4365625 28 8.9765625 28 L 9.0234375 28 C 9.5634375 28 10 27.563437 10 27.023438 L 10 22.228516 C 10.334707 21.839756 11.138423 21.046875 13.445312 21.046875 C 14.669313 21.046875 15.670422 21.473781 16.732422 21.925781 C 17.769422 22.367781 18.841891 22.824219 20.087891 22.824219 C 22.446891 22.824219 24.049375 21.584688 24.734375 21.054688 L 24.886719 20.939453 C 25.437719 20.540453 26 19.996 26 19 L 26 10.675781 C 26 9.7677812 25.221828 9 24.298828 9 C 23.803828 9 23.440406 9.2865937 22.941406 9.6835938 C 22.279406 10.207594 21.280891 11 20.087891 11 C 19.272891 11 18.477688 10.619734 17.554688 10.177734 C 16.403687 9.6257344 15.098359 9 13.443359 9 C 12.308257 9 11.421687 9.1883393 10.712891 9.4570312 C 11.489071 8.9141824 12 8.0167802 12 7 C 12 5.346 10.654 4 9 4 z M 9 6 C 9.552 6 10 6.449 10 7 C 10 7.551 9.552 8 9 8 C 8.448 8 8 7.551 8 7 C 8 6.449 8.448 6 9 6 z M 13.443359 11 C 14.645359 11 15.638406 11.476469 16.691406 11.980469 C 17.736406 12.482469 18.817891 13 20.087891 13 C 21.842891 13 23.158047 12.054484 23.998047 11.396484 L 23.998047 19.066406 C 23.997047 19.070406 23.952984 19.145266 23.708984 19.322266 L 23.509766 19.474609 C 22.942766 19.912609 21.762891 20.824219 20.087891 20.824219 C 19.249891 20.824219 18.446625 20.482937 17.515625 20.085938 C 16.372625 19.597938 15.076359 19.044922 13.443359 19.044922 C 11.891359 19.044922 10.786 19.358 10 19.75 L 10 12.361328 C 10.345 11.905328 11.132359 11 13.443359 11 z"></path>\n' +
                    //     '</svg>';
                    //
                    // const pinSvg =
                    //     parser.parseFromString(pinSvgString, 'image/svg+xml').documentElement;
                    //
                    // const templateForSvg = document.createElement('template');
                    // templateForSvg.content.append(pinSvg);
                    holeMarker.addEventListener('gmp-click', (event) => {
                           selectAndFlyToHole(hole);
                    });
                    // holeMarker.append(templateForSvg);
                    mapObject.append(holeMarker);
                }
            }
        }

    }

    function flyToHole(hole_number, step) {
        const hole = $courseStore.selectedHole;
        mapObject.flyCameraTo({
            endCamera: {
                center: {lat: hole.latitude[step], lng: hole.longitude[step], altitude: 0},
                // tilt: 67.5,
                range: 200
            },
            durationMillis: 1000
        });
    }


</script>
<IntroSection/>
{#each $courseStore.courses as course}
    <CourseOverview course={course}/>
{/each}

<!-- <div class="min-h-screen bg-base-200 p-10">
    <div class="text-center">
        <p class="py-6">Explore golf courses in 3D realism and take a virtual tour of your favorite courses.</p>
    </div>

    {#if !$courseStore.selectedCourse}
        <div class="grid grid-cols-2">
            {#each $courseStore.courses as course}
                <div class="card">
                    <figure>
                        <img height="400px" width="400px" src={imageList[course.image].default} alt={course}
                             class="rounded-3xl h-64">
                    </figure>
                    <div class="card-body items-center">
                        <button class="btn btn-primary w-fit" on:click={() => selectAndFlyToCourse(course)}>
                            {course}
                        </button>
                    </div>
                </div>

            {/each}
        </div>
    {:else if !$courseStore.selectedHole}
        <div class="text-center">
            <h2 class="text-3xl">Selected Course: {$courseStore.selectedCourse}</h2>
            <p class="py-4">Select a hole to continue:</p>
            <div class="grid grid-cols-6 gap-4">
                {#each $courseStore.selectedCourse.holes as hole}
                    <button class="btn btn-secondary" on:click={() => selectAndFlyToHole(hole)}>
                        Hole {hole}
                    </button>
                {/each}
            </div>
        </div>
    {:else}
        <div class="text-center">
            <h2 class="text-3xl">Course: {$courseStore.selectedCourse}</h2>
            <p class="py-4">Hole {$courseStore.selectedHole}</p>
            <div class="card w-full bg-base-100 shadow-xl">
                <div class="card-body">
                    <h2 class="card-title">{$courseStore.selectedCourse} - Hole {$courseStore.selectedHole}</h2>
                    <p>Experience this hole in full 3D realism with GolfScape's detailed virtual tour.</p>
                </div>
            </div>
            <button class="btn btn-outline mt-6" on:click={() => ($courseStore.selectedCourse = null)}>
                Back to Courses
            </button>
        </div>
    {/if}
    <div id="map_container" class="h-[500px]"></div>
</div> -->
