<script>
    import data from '$lib/data.json';
    const images = import.meta.glob('/src/lib/images/*.jpeg', { eager: true });
    let imageList = {};

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
    }
    console.log(imageList)
    function selectHole(hole) {
        selectedHole = hole;
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
</div>
