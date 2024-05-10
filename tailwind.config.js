/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bgMain: "hsl(228, 33%, 97%)",
        deepBlue: "hsl(212, 24%, 26%)",
        commentBlue: "hsl(211, 10%, 45%)",
        normalBlue: "hsl(238, 40%, 52%)",
        voteBg: "hsl(228, 33%, 97%)",
        voteText: "hsl(239, 57%, 85%)",
        red: "hsl(358, 79%, 66%)",
        lightGray: " hsl(223, 19%, 93%) ",
        overlay: "rgba(0,0,0,0.7)",
      },

      screens: {
        "-950": { max: "950px" },
        "-650": { max: "650px" },
        "-450": { max: "450px" },
      },
    },
  },
  plugins: [],
};
