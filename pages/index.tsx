import { ThemeProvider } from "@emotion/react";
import CssBaseline from "@mui/material/CssBaseline";
import { GetStaticProps } from "next";
import Head from "next/head";
import { useRecoilValue } from "recoil";
import { themeState } from "../atoms/theme";
import HomeComponent from "../components/HomeComponent";
import { MainProps } from "../types";


export default function Home({ DEPLOYED_URL }: MainProps) {
  const theme = useRecoilValue(themeState);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline enableColorScheme />
      <Head>
        <title>Blog Fast</title>
      </Head>
      <HomeComponent DEPLOYED_URL={DEPLOYED_URL} />
    </ThemeProvider>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {
      DEPLOYED_URL: process.env.DEPLOYED_URL,
    },
  };
}
