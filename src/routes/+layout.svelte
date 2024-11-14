<script context="module">
    export { load } from './+layout.js';
</script>

<script>
    import "../app.css";
    import { goto } from "$app/navigation"
    import Navbar from "../lib/components/Navbar.svelte";
    import { courseStore } from '../lib/stores/courseStore.js';
    import { onMount } from 'svelte';

</script>

<Navbar>
</Navbar>
<slot/>
