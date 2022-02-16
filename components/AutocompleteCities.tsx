import Autocomplete from "@mui/material/Autocomplete";
import { useState, useEffect, useCallback, SyntheticEvent } from "react";
import debounce from "lodash/debounce";
import TextField from "@mui/material/TextField";
import { AutocompleteCitiesProps } from "../types";

export default function AutocompleteCities({ DEPLOYED_URL, cityValue: setCityValue }: AutocompleteCitiesProps) {
  const [value, setValue] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [citySearchList, setCitySearchList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [csrfToken, setCsrfToken] = useState("");


  const inputValueChange = (_ev: SyntheticEvent, inputValueNew: string) => {
    setInputValue(inputValueNew);
  };
  const valueChange = (_ev: SyntheticEvent, valueNew: string) => {
    setValue(valueNew);
    setCityValue(valueNew);
  };

  useEffect(() => {
    setTimeout(async () => {
      setCsrfToken(String((await (await import("next-auth/react")).getCsrfToken())));
    }, 100);
  }, [])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearchCities = useCallback(
    debounce(async (search: string, DEPLOYED_URL: string, csrfToken: string) => {
      if (csrfToken === "") {
        setCsrfToken(String((await (await import("next-auth/react")).getCsrfToken())));
      }
      const citiesListRender = (await import("../lib/clientSideHelper/clientApiRequest/citiesListRender_User")).default
      const cityList = await citiesListRender(search, DEPLOYED_URL, csrfToken);
      setCitySearchList(cityList);
      setIsLoading(false);
    }, 1000),
    []
  );

  useEffect(() => {
    if (inputValue !== "" && value !== inputValue) {
      setIsLoading(true);
      debouncedSearchCities(inputValue, DEPLOYED_URL, csrfToken);
    }
  }, [inputValue, debouncedSearchCities, DEPLOYED_URL, csrfToken, value]);
  try {
    return (
      <section className="flex flex-grow justify-center">
        <Autocomplete
          aria-label="Select City to tag to blog"
          loading={isLoading}
          loadingText="Loading..."
          className="w-2/3 md:w-2/5"
          inputValue={inputValue}
          onChange={(_ev, valueNew) => valueChange(_ev, String(valueNew))}
          onInputChange={(_ev, inputValueNew) =>
            inputValueChange(_ev, inputValueNew)
          }
          options={citySearchList}
          renderInput={(params) => <TextField {...params} label="City" />}
        />
      </section>
    );
  } catch (err) {
    console.log(err);
  }
}


