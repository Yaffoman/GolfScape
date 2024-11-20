<script context="module">
    export { load } from './+layout.js';
</script>

<script>
    import "../app.css";
    import Navbar from "../lib/components/Navbar.svelte";

</script>

<Navbar />
<slot />