import { nextui } from "@nextui-org/theme";

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/components/(button|chip|code|image|input|kbd|link|listbox|navbar|select|skeleton|snippet|toggle|tabs|popover|ripple|spinner|divider|scroll-shadow).js",
  ],
  theme: {
    extend: {
      colors: {
        "media-brand": "rgb(var(--media-brand) / <alpha-value>)",
        "media-focus": "rgb(var(--media-focus) / <alpha-value>)",
      },
    },
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
    require("tailwind-scrollbar"),
    require("@vidstack/react/tailwind.cjs")({
      prefix: "media",
    }),
    customVariants,
  ],
};

function customVariants({ addVariant, matchVariant }) {
  matchVariant("parent-data", (value) => `.parent[data-${value}] > &`);

  addVariant("hocus", ["&:hover", "&:focus-visible"]);
  addVariant("group-hocus", [".group:hover &", ".group:focus-visible &"]);
}
