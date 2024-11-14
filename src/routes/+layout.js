import { setCourses } from "../lib/stores/courseStore";
export const ssr = false;

export async function load() {
    const response = await fetch('/lib/data.json');
    const data = await response.json();
    setCourses(data.courses);

    return {
        courses: data.courses
    };
}
