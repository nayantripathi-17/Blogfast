import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import { MenuOptionsProps } from "../types";

export default function MenuOptions({ menuOptions, anchorMenu, closeMenu, clickedMenuOption }: MenuOptionsProps) {
  return (
    <Menu
      className="mt-2"
      anchorEl={anchorMenu}
      open={Boolean(anchorMenu)}
      onClose={closeMenu}
    >
      {menuOptions?.map((menuOption) => (
        <MenuItem role="menuitem" aria-label={menuOption} key={menuOption} onClick={() => clickedMenuOption(menuOption)}>
          {menuOption}
        </MenuItem>
      ))}
    </Menu>
  );
}

