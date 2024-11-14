<script>
    export let course;
</script>


<div
  class="hero min-h-screen"
  style="background-image: url('/src/lib/images/{course.image}');">
  <div class="hero-overlay bg-opacity-60"></div>
  <div class="flex flex-col lg:flex-row">
    <div class="hero-content text-neutral-content text-center lg:text-left">
        <div class="max-w-lg">
          <h1 class="mb-5 text-5xl font-bold">{course.name}</h1>
          <p class="mb-5">
            {course.description}
          </p>
          <a href={`/course/${course.name.toLowerCase().replaceAll(" ", '-')}`} class="btn btn-primary">Visit Course</a>
          <!-- Stat list -->
        </div>
      </div>
      <div class="w-11/12 lg:w-auto mx-auto">
        <div class="stats stats-horizontal lg:stats-vertical shadow bg-opacity-65 bg-accent text-neutral-content w-full mx-auto">
            <div class="stat">
              <div class="stat-title text-base-100">Length</div>
              <div class="stat-value">{course.yardage.black}</div>
              <div class="stat-desc text-base-100">Black Tees</div>
            </div>
          
            <div class="stat">
              <div class="stat-title text-base-100">Par</div>
              <div class="stat-value">{course.par}</div>
              <!-- <div class="stat-desc">↗︎ 400 (22%)</div> -->
            </div>
          
            <div class="stat">
              <div class="stat-title text-base-100">Cost</div>
              <div class="stat-value">{course.cost}</div>
              <!-- <div class="stat-desc">↘︎ 90 (14%)</div> -->
            </div>
          </div>
    </div>
      
  </div>
  
</div>