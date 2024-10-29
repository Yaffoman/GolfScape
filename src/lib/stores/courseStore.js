import { writable } from 'svelte/store';

// Create a writable store
export const courseStore = writable({
    courses: [],          // List of courses
    selectedCourse: null, // Currently selected course
    selectedHole: null,   // Currently selected hole
});

// Function to set courses from data.json
export const setCourses = (courses) => {
    courseStore.update(store => {
        return { ...store, courses };
    });
};

// Function to select a course
export const selectCourse = (course) => {
    courseStore.update(store => {
        return { ...store, selectedCourse: course, selectedHole: null };
    });
};

// Function to select a hole
export const selectHole = (hole) => {
    courseStore.update(store => {
        return { ...store, selectedHole: hole };
    });
};
