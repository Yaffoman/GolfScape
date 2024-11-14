<script>
    import {courseStore} from '../lib/stores/courseStore';
    import CourseOverview from '../lib/components/CourseOverview.svelte';
    import IntroSection from '../lib/components/IntroSection.svelte';
</script>
<IntroSection/>
{#each $courseStore.courses as course}
   <CourseOverview course={course}/>
{/each}
