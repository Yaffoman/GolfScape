## Inspiration
As an avid golfer I always appreciate when courses have a fly through drone tour of their course. This allows me to experience the course prior to booking and get a feel for the course design. The problem is that very few courses provide this so the Google Maps 3D API was the perfect tool to solve this issue.
## What it does
Allows golfers a quick and informative tour of golf courses prior to their time on the course. On top of just viewing the course we were able to go one step further with the API and create 3D markers for various points of interest such as the tee boxes, bunkers, water hazards, and greens with real distances. This allows for the golfer to not only see the course but begin to plan how to attack each hole before they even arrive at the course.
## How we built it
For the frontend platform we used Sveltekit

## Challenges we ran into
Most of the challenges we ran into fell into 2 categories: API limitations and unfamiliarity with SvelteKit. This was Ethan’s first time deploying a SvelteKit app so there was a bit of a learning curve with how to organize code, manage state, and import data. These were not too hard to overcome with the help of Google and Gabe’s experience to fall back on. 

The API limitations were more of a core issue. We used most every part of the 3D Maps functionality, but we didn’t have the full control of the camera like we wanted. The flyCameraTo function was great, but didn’t have a way to customize the path to follow a curve rather than a straight line. Also, the camera tilt was heavily influenced by the altitude and range as it would fly over the course which caused some weird behaviors (zooming in and out between path points).

## Accomplishments that we're proud of
We are very proud of the interactions and visualizations we were able to achieve despite the somewhat limited camera controls. We were also able to integrate other APIs that gave us golf and weather data for added user value.

## What we learned
We learned to use the Google 3D Maps API and integrate it into Svelte. Since it is a pure javascript api we can use it in React and Angular apps in the future the same way too. Through using the api, we created algorithms to calculate optimal ranges for the different paths as well as the correct heading calculations for a smooth animation.

We also learned much more about the golf courses themselves and what rich data is available in the golf world.

## What's next for GolfScape
Draw altitude gradient on map
Optimal path planning based on course layout and par
AI caddy tips about how to play a hole
Mobile-optimizations
Export video functionality for clubs to use in marketing
Automated course import (color detection to get coordinates of features)

  
