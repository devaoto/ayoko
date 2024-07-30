import { nextui } from "@nextui-org/theme";

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/components/(button|code|image|input|kbd|link|listbox|navbar|skeleton|snippet|toggle|popover|ripple|spinner|divider).js",
  ],
  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [
    nextui({
      themes: {
        dark: {
          colors: {
            primary: {
              DEFAULT: "#41968e",
              foreground: "#FFFFFF",
            },
            secondary: {
              DEFAULT: "#8673a1",
              foreground: "#FFFFFF",
            },
            success: {
              DEFAULT: "#89AC76",
              foreground: "#FFFFFF",
            },
            warning: {
              DEFAULT: "#999950",
              foreground: "#FFFFFF",
            },
            danger: {
              DEFAULT: "#721422",
              foreground: "#FFFFFF",
            },
          },
        },
        light: {
          colors: {
            primary: {
              DEFAULT: "#D7EFEA",
              foreground: "#000000",
            },
            secondary: {
              DEFAULT: "#E4DCEF",
              foreground: "#000000",
            },
            success: {
              DEFAULT: "#D6E9D0",
              foreground: "#000000",
            },
            warning: {
              DEFAULT: "#E6E6B3",
              foreground: "#000000",
            },
            danger: {
              DEFAULT: "#D5A3A7",
              foreground: "#000000",
            },
          },
        },
      },
    }),
  ],
};
