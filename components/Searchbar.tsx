import { SyntheticEvent, useEffect, useState } from "react";
import Search from "@mui/icons-material/Search";
import Autocomplete from "@mui/material/Autocomplete";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import { SearchbarProps } from "../types";

function Searchbar({ DEPLOYED_URL, value, setValue, selectClick }:SearchbarProps) {
  const [inputValue, setInputValue] = useState("");
  const [isEmpty, setIsEmpty] = useState<boolean>(true);
  const [isFirstTimeFocused, setIsFirstTimeFocused] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [cities, setCities] = useState<string[]>([]);

  useEffect(() => {
    if (value === "" || value === "null") setIsEmpty(true);
    else setIsEmpty(false);
  }, [value])

  const inputValueChange = async (_evt: SyntheticEvent, inputValueNew: string) => {
    setInputValue(inputValueNew);
  };
  const valueChange = (_evt: SyntheticEvent, valueNew: string) => {
    setValue(valueNew);
  };
  const firstTimeFocus = async() => {
    if (!isFirstTimeFocused) {
      setIsLoading(true);
      setIsFirstTimeFocused(true);  
      const arrayCities = await (await import("../lib/clientSideHelper/clientApiRequest/getCitiesUser_User")).getCities(DEPLOYED_URL)
      setCities(arrayCities);
      setIsLoading(false);
    }
  }

  return (
    <section aria-label="Searchbar" className="flex flex-grow justify-center items-center mt-10">
      <Autocomplete
        aria-label="Select city"
        className=" w-60 mr-2 sm:w-72 md:w-96"
        disablePortal={true}
        inputValue={inputValue}
        loading={isLoading}
        onChange={(evt, value) => valueChange(evt, String(value))}
        onInputChange={(evt, inputValue) => inputValueChange(evt, inputValue)}
        options={cities}
        onFocus={firstTimeFocus}
        renderInput={(params) => <TextField {...params} label="Location" />}
      />
      <IconButton disabled={isEmpty} aria-label="Search by selected city" onClick={selectClick} className="inline">
        <Search fontSize="large" />
      </IconButton>
    </section>
  );
}

export default Searchbar;
