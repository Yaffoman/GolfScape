<script>
    import { onMount } from "svelte";
    import {courseStore, setMapObject} from "../stores/courseStore";
    import {flyToCourse} from "$lib";
    
    let mapObject;
    let google = window.google;

    onMount(async () => {
        console.log("calling on mount!!")
        const {Map3DElement} = await google.maps.importLibrary("maps3d");
        mapObject = new Map3DElement({
            center: {lat: 37.36353, lng: -121.9286, altitude: 10000},
            tilt: 67.5,
            range: 100000000,
            defaultLabelsDisabled: true
        });
        document.getElementById('map_container')?.append(mapObject);
        setMapObject(mapObject); 
        flyToCourse($courseStore.selectedCourse);
    })


</script>

<div id="map_container" class="h-full w-full"></div>
