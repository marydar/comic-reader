// import type {Config} from "tailwindcss"
// const config = {
//     darkMode: ["class"],
//     content: [
//         './pages/**/*.{ts, tsx}',
//         './components/**/*.{ts, tsx}',
//         './app/**/*.{ts, tsx}',
//         './src/**/*.{ts, tsx}',
//     ],
//     prefix: "",
//     theme: {
//         container:{
//             center: true,
//             padding: "2rem",
//             screens:{
//                 "2xl": "1400px",
//             },
//         },
//     }
// }

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",  // <--- important!
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
