import { nextui } from "@nextui-org/theme";
import plugin from "tailwindcss/plugin";
import { Config, PluginAPI } from "tailwindcss/types/config";

const radialGradientPlugin = plugin(
  function ({ matchUtilities, theme }: PluginAPI) {
    matchUtilities(
      {
        "bg-radient": (value) => ({
          "background-image": `radial-gradient(${value},var(--tw-gradient-stops))`,
        }),
      },
      { values: theme("radialGradients") },
    );
  },
  {
    theme: {
      radialGradients: _presets(),
    },
  },
);

function _presets(): Record<string, string> {
  const shapes = ["circle", "ellipse"] as const;
  const pos = {
    c: "center",
    t: "top",
    b: "bottom",
    l: "left",
    r: "right",
    tl: "top left",
    tr: "top right",
    bl: "bottom left",
    br: "bottom right",
  };

  const result: Record<string, string> = {};

  for (const shape of shapes) {
    for (const [posName, posValue] of Object.entries(pos)) {
      result[`${shape}-${posName}`] = `${shape} at ${posValue}`;
    }
  }

  return result;
}

/** @type {Config} */
const config: Config = {
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
              DEFAULT: "#4A90E2",
              foreground: "#E0E0E0",
            },
            secondary: {
              DEFAULT: "#B0BEC5",
              foreground: "#37474F",
            },
            success: {
              DEFAULT: "#66BB6A",
              foreground: "#E0E0E0",
            },
            warning: {
              DEFAULT: "#FFCA28",
              foreground: "#E0E0E0",
            },
            danger: {
              DEFAULT: "#EF5350",
              foreground: "#E0E0E0",
            },
            background: {
              DEFAULT: "#121212",
              foreground: "#E0E0E0",
            },
            foreground: {
              DEFAULT: "#E0E0E0",
              foreground: "#E0E0E0",
            },
          },
        },
        light: {
          colors: {
            primary: {
              DEFAULT: "#0056D2",
              foreground: "#343A40",
            },
            secondary: {
              DEFAULT: "#6C757D",
              foreground: "#343A40",
            },
            success: {
              DEFAULT: "#28A745",
              foreground: "#343A40",
            },
            warning: {
              DEFAULT: "#FFC107",
              foreground: "#343A40",
            },
            danger: {
              DEFAULT: "#DC3545",
              foreground: "#343A40",
            },
            background: {
              DEFAULT: "#F8F9FA",
              foreground: "#343A40",
            },
            foreground: {
              DEFAULT: "#343A40",
              foreground: "#343A40",
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
    radialGradientPlugin,
  ],
};

function customVariants({ addVariant, matchVariant }: PluginAPI) {
  matchVariant("parent-data", (value: string) => `.parent[data-${value}] > &`);

  addVariant("hocus", ["&:hover", "&:focus-visible"]);
  addVariant("group-hocus", [".group:hover &", ".group:focus-visible &"]);
}

export default config;
