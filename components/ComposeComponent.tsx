import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import TextfieldTitle from "./TextfieldTitle";
import CircularLoading from "./CircularLoading";
import { loggedInSettings, pages, loggedOutSettings } from "../lib/clientSideHelper/userAndNavOptions";
import { FormSubmitHandler, MainProps, TextFieldValueChangeEvent, TextFieldValueChangeHandler } from "../types";


//Dynamic Imports
const DynamicTopNavbar = dynamic(() => import("./TopNavbar"), {
  loading: () => <CircularLoading />,
});
const DynamicSubmitButton = dynamic(() => import("./SubmitButton"), {
  loading: () => <CircularLoading />,
});

//@ts-ignore
const DynamicAutocompleteCities = dynamic(() => import("./AutocompleteCities"), {
  loading: () => <CircularLoading />,
});
const DynamicTextfieldContent = dynamic(() => import("./TextfieldContent"), {
  loading: () => <CircularLoading />,
});


//Component
function ComposeComponent({ DEPLOYED_URL }: MainProps) {
  //Use Session Hook
  const { data: session } = useSession();
  const router = useRouter();

  const [titleValue, setTitleValue] = useState<string>("");
  const [contentValue, setContentValue] = useState("");
  const [cityValue, setCityValue] = useState<string>("");
  const [isButtonVisible, setIsButtonVisible] = useState<boolean>(false);
  const [isAutocompleteVisible, setIsAutocompleteVisible] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [csrfToken, setCsrfToken] = useState("");


  //User settings according to authentication status
  const settings = session ? loggedInSettings : loggedOutSettings;

  //Get csrf token and embed it in form
  useEffect(() => {
    setTimeout(async () => {
      setCsrfToken(String((await (await import("next-auth/react")).getCsrfToken())));
    }, 100);
  }, [])
  //Calculate Title and Content Length
  const calculateTitleLength: TextFieldValueChangeHandler = (event: TextFieldValueChangeEvent) => {
    setTitleValue(String(event.target.value));
  };
  const calculateContentLength: TextFieldValueChangeHandler = (event: TextFieldValueChangeEvent) => {
    setContentValue(String(event.target.value));
  };

  useEffect(() => {
    if (
      contentValue.length > 0 &&
      titleValue.length > 0 &&
      isAutocompleteVisible === false
    ) {
      setIsAutocompleteVisible(true);
    }
  }, [contentValue, titleValue, isAutocompleteVisible]);

  //Check if Session/Title/Content/City is empty to activate button
  useEffect(() => {
    if (
      session &&
      titleValue !== "" &&
      contentValue !== "" &&
      cityValue !== "" &&
      cityValue !== "null" &&
      csrfToken !== "")
      setIsButtonVisible(true);
    else
      setIsButtonVisible(false);

  }, [titleValue, contentValue, cityValue, session, csrfToken]);

  const submitBlog = async (event: FormSubmitHandler) => {
    event.preventDefault();
    if (!isSubmitted) {
      setIsLoading(true);
      const postBlog = (await import("../lib/clientSideHelper/clientApiRequest/postBlog_User")).default;
      const formData = new FormData(event.target as HTMLFormElement);
      formData.append('city', cityValue);
      const blogId = await postBlog(formData, DEPLOYED_URL);
      if (blogId.trim() === "") {
        setIsSubmitted(false);
        setIsLoading(false);
        return;
      }
      setIsSubmitted(true);
      setIsLoading(false);
      router.push(`/blog/${blogId}`);
    }
  };

  return (
    <form onSubmit={submitBlog} id="compose_form">
      <input
        className="hidden"
        name="csrfToken"
        value={csrfToken}
        readOnly={true}
      />
      <DynamicTopNavbar settings={settings} pages={pages} session={session} />
      <main className="m-5">

        <h2 className="ml-5 text-left text-6xl">Compose</h2>
        <TextfieldTitle
          textValue={titleValue}
          calculateTextLength={calculateTitleLength}
        />
        <DynamicTextfieldContent
          textValue={contentValue}
          calculateTextLength={calculateContentLength}
        />

        {isAutocompleteVisible && (
          <DynamicAutocompleteCities
            DEPLOYED_URL={DEPLOYED_URL}
            cityValue={setCityValue}
          />
        )}

        <section className="mt-3 flex flex-grow justify-center">
          {isButtonVisible && (
            <DynamicSubmitButton
              isSubmitted={isSubmitted}
              isLoading={isLoading}
            />
          )}
        </section>
      </main>
    </form>
  );
}

export default ComposeComponent;
