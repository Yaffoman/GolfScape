<script>
    export let course;
</script>


<div
  class="hero min-h-screen"
  style="background-image: url('/src/lib/images/{course.image}');">
  <div class="hero-overlay bg-opacity-60"></div>
  <div class="hero-content text-neutral-content text-center">
    <div class="max-w-lg">
      <h1 class="mb-5 text-5xl font-bold">{course.name}</h1>
      <p class="mb-5">
        {course.description}
      </p>
      <!-- Stat list -->
      <button class="btn btn-primary">Get Started</button>
    </div>
  </div>
</div>