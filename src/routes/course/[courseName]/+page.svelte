<!-- <script context="module">   
    export { load } from './+page.js';
</script> -->

<script>
    import { onMount } from "svelte";
    import { courseStore } from "../../../lib/stores/courseStore";
    import Map from "../../../lib/components/Map.svelte";
    import { flyThroughHole } from "$lib";
    import WeatherWidget from '$lib/components/WeatherWidget.svelte';

    console.log($courseStore.selectedCourse)

    function handleHoleSelection(hole) {
        console.log(hole)
        flyThroughHole(hole)
    }

    function handlePrevHole() {
        const curHoleIndex = $courseStore.selectedHole.hole
        const prevHoleIndex = curHoleIndex - 1
        flyThroughHole($courseStore.selectedCourse.holes[prevHoleIndex - 1])
    }

    function handleNextHole() {
        const curHoleIndex = $courseStore.selectedHole.hole
        const nextHoleIndex = curHoleIndex + 1
        flyThroughHole($courseStore.selectedCourse.holes[nextHoleIndex - 1])
    }

    function getTeeColor(colorKey) {
        switch (colorKey.toLowerCase()) {
            case 'black':
                return 'bg-black';
            case 'brown':
                return 'bg-amber-800';
            case 'green':
                return 'bg-green-600';
            case 'white':
                return 'bg-white';
            case 'yellow':
            case 'gold':
                return 'bg-yellow-400';
            case 'blue':
                return 'bg-blue-600';
            default:
                return 'bg-gray-400';
        }
    }

</script>

<div class="h-100vh w-screen">
    <div class="relative">
        <div
            class="hero min-h-[20vh]"
            style="background-image: url(/images/{$courseStore.selectedCourse.image});">
            <div class="hero-overlay bg-opacity-60"></div>
            <div class="hero-content text-neutral-content text-center">
                <div class="max-w-md">
                <h1 class="text-5xl font-bold">{$courseStore.selectedCourse.name}</h1>
                </div>
            </div>
        </div>
    
        <a class="absolute left-2 top-5 btn btn-xs sm:btn-sm md:btn-md lg:btn-lg bg-opacity-0 border-none shadow-none text-neutral-content" href="/">
            <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor">
            <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 19l-7-7 7-7" />
            </svg>
            Back to courses
        </a>
    </div>
    
    <div class="w-full h-full flex flex-row">
        <div class="min-w-52 h-[520px] flex flex-col items-center mt-4">
            <div class="h-full bg-base-200 rounded p-4 shadow">
                <h1 class="text-center text-xl font-bold text-secondary mb-4">Hole Selection</h1>
                <div class="grid grid-cols-[1fr_auto_1fr] gap-1">
                    <!-- Front 9 -->
                    <div class="flex flex-col items-center">
                        <span class="text-center text-sm font-medium mb-2">Front 9</span>
                        {#each $courseStore.selectedCourse.holes.slice(0, 9) as hole, index}
                            <button 
                                class="btn btn-sm h-[42px] w-14 my-0.5 text-neutral-content bg-primary hover:bg-primary-focus transition-colors"
                                class:!bg-error={$courseStore.selectedHole?.hole === (index + 1)}
                                class:shadow-lg={$courseStore.selectedHole?.hole === (index + 1)}
                                on:click={() => handleHoleSelection(hole)}>
                                {index + 1}
                            </button>
                        {/each}
                    </div>
                    <div class="divider divider-horizontal mx-1"></div>
                    <!-- Back 9 -->
                    <div class="flex flex-col items-center">
                        <span class="text-center text-sm font-medium mb-2">Back 9</span>
                        {#each $courseStore.selectedCourse.holes.slice(9, 18) as hole, index}
                            <button 
                                class="btn btn-sm h-[42px] w-14 my-0.5 text-neutral-content bg-primary hover:bg-primary-focus transition-colors"
                                class:!bg-error={$courseStore.selectedHole?.hole === (index + 10)}
                                class:shadow-lg={$courseStore.selectedHole?.hole === (index + 10)}
                                on:click={() => handleHoleSelection(hole)}>
                                {index + 10}
                            </button>
                        {/each}
                    </div>
                </div>
            </div>
        </div>
        <div class="w-full h-[520px] flex flex-col p-4 bg-base-200 rounded shadow my-4">
            <Map/>
            <div class="w-fit join grid grid-cols-2 mx-auto mt-4">
                <button class="join-item btn btn-outline btn-secondary" class:btn-disabled={!$courseStore.selectedHole} on:click={handlePrevHole}>Prev hole</button>
                <button class="join-item btn btn-outline btn-primary" class:btn-disabled={!$courseStore.selectedHole} on:click={handleNextHole}>Next hole</button>
            </div>
        </div>
        <div class="min-w-80 flex flex-col items-center mt-4">
            <!-- Course Information Card -->
            <!-- {#if !$courseStore.selectedHole} -->
                <div class="p-4 bg-base-200 rounded shadow w-72 mb-4">
                    <div class="flex flex-row items-center mb-4">
                        <h1 class="text-left text-2xl font-bold text-secondary">
                            Course
                        </h1>
                        <div class="divider divider-horizontal"></div>
                        <div class="text-left">
                            <span class="text-xl font-semibold text-primary">
                                Par { $courseStore.selectedCourse.par }
                            </span>
                        </div>
                    </div>
        
                    <h2 class="font-semibold text-lg mb-2">Total Yardage</h2>
                    <div class="grid grid-cols-2 gap-2 mb-4">
                        {#each Object.entries($courseStore.selectedCourse.yardage) as [color, yards]}
                            <div class="flex items-center gap-2">
                                <div class="w-3 h-3 rounded-full {getTeeColor(color)}"></div>
                                <p>{color.charAt(0).toUpperCase() + color.slice(1)}: <span class="font-medium">{yards}</span></p>
                            </div>
                        {/each}
                    </div>
                    <WeatherWidget latitude={$courseStore.selectedCourse.latitude} longitude={$courseStore.selectedCourse.longitude} />
                </div>
            <!-- {/if} -->
    
            <!-- Hole Information Card (Only shown when hole is selected) -->
            {#if $courseStore.selectedHole}
                <div class="p-4 bg-base-200 rounded shadow w-72">
                    <div class="flex flex-row items-center mb-4">
                        <h1 class="text-left text-2xl font-bold text-secondary">
                            Hole { $courseStore.selectedHole.hole }
                        </h1>
                        <div class="divider divider-horizontal"></div>
                        <div class="text-left">
                            <span class="text-xl font-semibold text-primary">
                                Par { $courseStore.selectedHole.par }
                            </span>
                        </div>
                    </div>
    
                    <div class="space-y-2">
                        <div class="flex flex-row">
                            <h2 class="font-semibold text-lg">Yardage</h2>
                            <div class="divider divider-horizontal mx-[0px]"></div>
                            <h3 class="font-semibold text-lg">
                                Handicap { $courseStore.selectedHole.handicap }
                            </h3>
                        </div>
                        
                        <div class="grid grid-cols-2 gap-2">
                            {#each Object.entries($courseStore.selectedHole.yardage) as [color, yards]}
                                <div class="flex items-center gap-2">
                                    <div class="w-3 h-3 rounded-full {getTeeColor(color)}"></div>
                                    <p>{color.charAt(0).toUpperCase() + color.slice(1)}: <span class="font-medium">{yards}</span></p>
                                </div>
                            {/each}
                        </div>
                    </div>
                </div>
            {/if}
        </div>
    </div>
</div>


