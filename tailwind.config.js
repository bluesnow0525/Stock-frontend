import { fontFamily } from 'tailwindcss/defaultTheme';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      whitespace: {
        'pre-line': 'pre-line',
      },
      screens: {
        '3xl': '1920px', // 添加一个新的断点 '3xl'
        '4xl': '2560px', // 添加一个新的断点 '4xl'
        // 您可以根据需要添加更多的断点
      },
      colors: {
        color: {
          1: "#AC6AFF",
          2: "#FFC876",
          3: "#FF776F",
          4: "#7ADB78",
          5: "#858DFF",
          6: "#FF98E2",
        },
        stroke: {
          1: "#26242C",
        },
        n: {
          1: "#FFFFFF",
          2: "#CAC6DD",
          3: "#ADA8C3",
          4: "#757185",
          5: "#3F3A52",
          6: "#252134",
          7: "#15131D",
          8: "#0E0C15",
          9: "#474060",
          10: "#43435C",
          11: "#1B1B2E",
          12: "#2E2A41",
          13: "#6C7275",
        },
      },
      fontFamily: {
        sans: ["var(--font-sora)", ...fontFamily.sans],
        code: "var(--font-code)",
        grotesk: "var(--font-grotesk)",
        mono: ['Roboto Mono', 'monospace'],
        // han: ['WenYue-YuGothic-Bold', 'sans-serif'],
      },
      letterSpacing: {
        tagline: ".15em",
      },
      spacing: {
        0.25: "0.0625rem",
        7.5: "1.875rem",
        15: "3.75rem",
        1: '0.55rem',
      },
      opacity: {
        15: ".15",
      },
      transitionDuration: {
        DEFAULT: "200ms",
      },
      transitionTimingFunction: {
        DEFAULT: "linear",
      },
      zIndex: {
        1: "1",
        2: "2",
        3: "3",
        4: "4",
        5: "5",
      },
      borderWidth: {
        DEFAULT: "0.0625rem",
      },
      backgroundImage: {
        "radial-gradient": "radial-gradient(var(--tw-gradient-stops))",
        "conic-gradient":
          "conic-gradient(from 225deg, #FFC876, #79FFF7, #9F53FF, #FF98E2, #FFC876)",
        "black-30":'rgba(0, 0, 0, 0.4)',
      },
    },
    variants: {
      extend: {
        translate: ['hover', 'focus'],
      },
    },
  },
  plugins: [],
}
