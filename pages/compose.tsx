import { ThemeProvider } from "@emotion/react";
import CssBaseline from "@mui/material/CssBaseline";
import { useRecoilValue } from "recoil";
import { themeState } from "../atoms/theme";
import Head from "next/head";
import ComposeComponent from "../components/ComposeComponent";
import { GetStaticProps } from "next";

export default function Compose({ DEPLOYED_URL }: { DEPLOYED_URL: string }) {
  const theme = useRecoilValue(themeState);


  return (
    <ThemeProvider theme={theme}>
      <CssBaseline enableColorScheme />
      <Head>
        <title>Compose</title>
      </Head>
      <ComposeComponent DEPLOYED_URL={DEPLOYED_URL} />
    </ThemeProvider>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const DEPLOYED_URL: string = String(process.env.DEPLOYED_URL);
  return {
    props: {
      DEPLOYED_URL,
    }
  };
}
