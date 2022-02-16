import { createTheme, ThemeOptions } from "@mui/material";
import { atom } from "recoil";
// import { useTheme } from "@mui/material/styles";

const customBreakpoints = {
  values: {
    xs: 0,
    sm: 600,
    md: 768,
    lg: 1024,
    xl: 1280,
  },
};

export const lightTheme = createTheme({
  breakpoints: customBreakpoints,
  palette: {
    mode: "light",
    primary: {
      main: "#152D31"
    },
    background: {
      default:"#6CB5C040",
      paper: "#fff"
    }
  },
});

const darkThemeOptions: ThemeOptions = {
  breakpoints: customBreakpoints,
  palette: {
    mode: "dark",
    primary: {
      main: "#0ECADF"
    },

    background: {
      default: "#121212",
      paper: "#001A1D"
    }
  },
}

export const darkTheme = createTheme(darkThemeOptions);

export const themeState = atom({
  key: "themeState",
  default: darkTheme,
});
