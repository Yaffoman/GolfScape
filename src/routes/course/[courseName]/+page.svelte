<!-- <script context="module">   
    export { load } from './+page.js';
</script> -->

<script>
    import { onMount } from "svelte";
    import { courseStore } from "../../../lib/stores/courseStore";
    import Map from "../../../lib/components/Map.svelte";
    console.log($courseStore.selectedCourse)

</script>
<div class="relative">
    <div
        class="hero min-h-[20vh]"
        style="background-image: url(/src/lib/images/{$courseStore.selectedCourse.image});">
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

<Map/>
