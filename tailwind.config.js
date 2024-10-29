import daisyui from "daisyui";
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  theme: {
    extend: {},
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        golfscape: {
          primary: "#3E5F34",

          secondary: "#7a4e36",

          accent: "#AfA77F",

          neutral: "#534b45",

          "base-100": "#f0efe6",

          info: "#5f8d82",

          success: "#89a67e",

          warning: "#c99a5d",

          error: "#8b3a30",
        },
      },
    ],
  },
};
