import { setCourses } from "../lib/stores/courseStore";
export const ssr = false;
import * as data from "$lib/data.json";

export async function load() {
    setCourses(data.courses);

    return {
        courses: data.courses
    };
}
