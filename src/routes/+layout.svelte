<script>
  import { onMount } from "svelte";
    import "../app.css";
    import Navbar from "../lib/components/Navbar.svelte";
    import { courseStore, setCourses } from "../lib/stores/courseStore";

    onMount(async () => {
        const response = await fetch('src/lib/data.json');
        const data = await response.json();
        setCourses(data.courses);
        console.log($courseStore)
    })
</script>

<Navbar>
</Navbar>
<slot/>
