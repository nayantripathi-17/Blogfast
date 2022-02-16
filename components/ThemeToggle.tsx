import { useRecoilState } from "recoil";
import { darkTheme, lightTheme, themeState } from "../atoms/theme";
import { Switch, Theme } from "@mui/material";
import { useState } from "react";
import DarkModeIcon from "./DarkModeIcon";
import LightModeIcon from "./LightModeIcon";

function ThemeToggle() {
  const [theme, setTheme] = useRecoilState<Theme>(themeState);
  const [isChecked, setIsChecked] = useState<boolean>(theme.palette.mode === "dark" ? true : false);

  /* Theme */
  const setThemetoDark = () => {
    if (theme.palette.mode === "light") {
      setTheme(darkTheme)
      setIsChecked(true);
    }
  }
  const setThemeToLight = () => {
    if (theme.palette.mode === "dark") {
      setTheme(lightTheme);
      setIsChecked(false)
    }
  }

  return (
    <>
      <Switch
        role="switch"
        aria-label="Theme Toggle"
        aria-checked={isChecked}
        aria-labelledby={isChecked ? "Dark-Label" : "Light-Label"}
        checked={isChecked}
        checkedIcon={<DarkModeIcon />}
        icon={<LightModeIcon />}
        disableFocusRipple={true}
        disableRipple={true}
        disableTouchRipple={true}
        classes={{
          root: "w-16 p-0 px-2.5 mr-4 items-center ml-4",
          switchBase: "bottom-[0px]  hover:!bg-transparent",
          track: `${(theme.palette.mode === 'dark' ? `!bg-gray-400` : `!bg-gray-200`)} rounded-[6px] right-[100px] h-5`
        }}
        onClick={() => {
          theme.palette.mode === "dark" ? setThemeToLight() : setThemetoDark()
        }}
      />
    </>
  )
}

export default ThemeToggle;
