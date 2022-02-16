//Imports from MUI
import AppBar from "@mui/material/AppBar";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import useMediaQuery from "@mui/material/useMediaQuery";
import MenuIcon from "@mui/icons-material/Menu";

//Imports from Next
import dynamic from "next/dynamic";
import { signIn, signOut } from "next-auth/react";
import { NextRouter, useRouter } from "next/router";
//All other Imports
import { useState } from "react";
//Component Imports
import ThemeToggle from "./ThemeToggle";
import { ClickHandler, NavbarProps } from "../types";
import { ThemeProvider } from "@emotion/react";
import { darkTheme } from "../atoms/theme";

const DynamicMenuOptions = dynamic(() => import("./MenuOptions"));

const TopNavbar = ({ settings, pages, session }: NavbarProps) => {
  const router: NextRouter = useRouter();
  const [navMenu, setNavMenu] = useState<null | HTMLElement>(null);
  const [userMenu, setUserMenu] = useState<null | HTMLElement>(null);
  const [isMenuAvatarClicked, setIsMenuAvatarClicked] = useState<boolean>(false);
  const [isNavMenuClicked, setIsNavMenuClicked] = useState<boolean>(false);

  /* Nav Menu */
  //Open
  const openNavMenu = (event: ClickHandler) => {
    if (!isNavMenuClicked) {
      setIsNavMenuClicked(true);
    }
    setNavMenu(event.currentTarget);
  };
  //Close
  const closeNavMenu = () => {
    setNavMenu(null);
  };
  //Choice Handling
  const navMenuOption = (clickedMenuOption: string) => {
    switch (clickedMenuOption.toLowerCase()) {
      case "compose":
        router.push("/compose");
        break;
      case "home":
        router.push("/");
        break;
      default:
        break;
    }
    if (!screenWidthMd) {
      closeNavMenu();
    }
  };

  /* User Menu */
  //Open
  const openUserMenu = (event: ClickHandler) => {
    if (!isMenuAvatarClicked) {
      setIsMenuAvatarClicked(true);
    }
    setUserMenu(event.currentTarget);
  };
  //Close
  const closeUserMenu = () => {
    setUserMenu(null);
  };
  //Choice Handling
  const userMenuOption = (clickedMenuOption: string) => {
    switch (clickedMenuOption.toLowerCase()) {
      case "logout":
        signOut();
        break;
      case "login with google":
        signIn("google");
        break;
      case "profile":
        router.push("/profile");
        break;
      default:
        break;
    }
    closeUserMenu();
  };

  const preventClickAnchorActivate = (event: ClickHandler) => {
    if (event.type === "click") {
      event.preventDefault();
    }
  };

  //Returns True if screen width >= 768px
  const screenWidthMd = useMediaQuery("(min-width:768px)");

  return (
    <ThemeProvider theme={darkTheme}>
      <AppBar aria-label="Navbar" position="static">
        <nav className="px-6 max-w-screen-2xl">
          <section className="flex flex-grow justify-between relative items-center min-h-[64px]">
            <Typography
              aria-label="BlogFast"
              variant="h6"
              noWrap
              component="div"
              classes={{
                root: "mr-4 hidden md:flex",
              }}
            >
              BlogFast
            </Typography>

            {Boolean(pages?.length) && (
              <div className="flex flex-grow md:hidden justify-start">
                <IconButton
                  size="large"
                  aria-label="Nav Menu"
                  aria-controls="Nav Items"
                  aria-haspopup="true"
                  onClick={openNavMenu}
                >
                  <MenuIcon />
                </IconButton>

                {!screenWidthMd && isNavMenuClicked && pages !== undefined && (
                  <DynamicMenuOptions
                    menuOptions={pages}
                    anchorMenu={navMenu}
                    closeMenu={closeNavMenu}
                    clickedMenuOption={navMenuOption}
                  />
                )}
              </div>
            )}

            {screenWidthMd && (
              <Box className="flex-grow">
                {pages?.map((page) => (
                  <Typography
                    key={page}
                    className="inline mx-4 cursor-pointer"
                    onClick={() => navMenuOption(page)}
                  >
                    {
                      <a
                        aria-label={page}
                        onClick={preventClickAnchorActivate}
                        href={page === "home" ? `/` : `/${String(page).toLowerCase()}`}
                      >
                        {String(page)}
                      </a>
                    }
                  </Typography>
                ))}
              </Box>
            )}

            {!screenWidthMd && (
              <Typography aria-label={"User's Name"} variant="body1" noWrap={true} component="div">
                {session ? session?.user?.name : "User"}
              </Typography>
            )}

            <Box className="flex flex-grow justify-end items-center">
              {screenWidthMd && (
                <Typography variant="h6" noWrap={true} component="div">
                  {session ? session?.user?.name : "User"}
                </Typography>
              )}
              <ThemeToggle />

              <Tooltip title="Open User Menu">
                <IconButton
                  aria-label="User Menu"
                  aria-controls="User Items"
                  aria-haspopup="true"
                  onClick={openUserMenu} className="p-0">
                  <Avatar
                    alt="Profile Photo"
                    src={String(session ? session?.user?.image : "")}
                  >
                    {String(session ? session?.user?.name : "User")
                      .substring(0, 1)
                      .toUpperCase()}
                  </Avatar>
                </IconButton>
              </Tooltip>
              {Boolean(settings?.length) && isMenuAvatarClicked && settings !== undefined && (
                <DynamicMenuOptions
                  menuOptions={settings}
                  anchorMenu={userMenu}
                  closeMenu={closeUserMenu}
                  clickedMenuOption={userMenuOption}
                />
              )}
            </Box>
          </section>
        </nav>
      </AppBar>
    </ThemeProvider>
  );
};
export default TopNavbar;
