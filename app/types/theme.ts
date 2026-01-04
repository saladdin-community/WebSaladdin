// app/types/theme.ts
export type ThemeColors = {
  primary: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
  };
  secondary: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
  };
};

export type ThemeConfig = {
  colors: ThemeColors;
  fonts: {
    sans: string;
    serif: string;
    arabic: string;
    mono: string;
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    "2xl": string;
    "3xl": string;
    full: string;
  };
};

export const themeConfig: ThemeConfig = {
  colors: {
    primary: {
      50: "#FEFCE8",
      100: "#FEF9C3",
      200: "#FEF08A",
      300: "#FDE047",
      400: "#FACC15",
      500: "#D4AF35",
      600: "#B8961F",
      700: "#977C0F",
      800: "#7A640A",
      900: "#5C4D06",
    },
    secondary: {
      50: "#262626",
      100: "#1F1F1F",
      200: "#1A1A1A",
      300: "#171717",
      400: "#141414",
      500: "#121212",
      600: "#0F0F0F",
      700: "#0D0D0D",
      800: "#0A0A0A",
      900: "#080808",
    },
  },
  fonts: {
    sans: "Inter, system-ui, -apple-system, sans-serif",
    serif: "Playfair Display, Times New Roman, serif",
    arabic: "Scheherazade New, serif",
    mono: "Fira Code, monospace",
  },
  borderRadius: {
    sm: "0.375rem",
    md: "0.5rem",
    lg: "0.75rem",
    xl: "1rem",
    "2xl": "1.5rem",
    "3xl": "2rem",
    full: "9999px",
  },
};
