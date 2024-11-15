import { selectCourse } from "../../../lib/stores/courseStore";

export async function load({ params }) {
    console.log('params', params);
    const { courseName } = params;
    console.log('courseName', courseName);

    // Fetch the courses data
    const response = await fetch('/lib/data.json'); 
    const data = await response.json();
    const courses = data.courses; 

    console.log('Fetched courses:', courses);

    const selectedCourse = courses.find(course => 
        course.name.toLowerCase().replaceAll(" ", '-') === courseName.toLowerCase()
    );

    console.log('Selected course:', selectedCourse); 

    if (!selectedCourse) {
        return { status: 404, error: new Error('Course not found') };
    }

    selectCourse(selectedCourse);

    return {
        course: selectedCourse 
    };
}