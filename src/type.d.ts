import { PaletteColor } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Palette {

    customButton?: {
      colorBackground?: string,
      colorText?: string
    };

    customNavbar?: {
      background?: string,
      color?: string,
      menuTextColor?: string,
      icon?: string
    };

  }

  interface PaletteOptions {

    customButton?: {
      colorBackground?: string,
      colorText?: string
    };

    customNavbar?: {
      background?: string,
      color?: string
      menuTextColor?: string
      icon?: string
    };

  }
}