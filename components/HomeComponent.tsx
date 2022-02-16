import { useSession } from "next-auth/react";
import { useState } from "react";
import MiniBlogRenderer from "./MiniBlogRenderer";
import Searchbar from "./Searchbar";
import TopNavbar from "./TopNavbar";
import { loggedInSettings, pages, loggedOutSettings } from "../lib/clientSideHelper/userAndNavOptions";
import { MainProps } from "../types";


//Component
function HomeComponent({ VERCEL_URL }: MainProps) {

  const { data: session } = useSession();
  const [value, setValue] = useState<string>("");
  const [searchValue, setSearchValue] = useState<string>("");


  //User settings according to authentication status
  const settings = (session ? loggedInSettings : loggedOutSettings)

  const selectCityClick = () => {
    if (value !== "" && value !== "null") {
      //search with value
      setSearchValue(value);
    }
  }


  return (
    <>
      <TopNavbar settings={settings} pages={pages} session={session} />
      <Searchbar VERCEL_URL={VERCEL_URL} value={value} setValue={setValue} selectClick={selectCityClick} />
      <MiniBlogRenderer VERCEL_URL={VERCEL_URL} newCityValue={String(searchValue)} />
    </>
  );
}

export default HomeComponent;
