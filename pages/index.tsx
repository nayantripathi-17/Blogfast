import { ThemeProvider } from "@emotion/react";
import CssBaseline from "@mui/material/CssBaseline";
import { GetStaticProps } from "next";
import Head from "next/head";
import { useRecoilValue } from "recoil";
import { themeState } from "../atoms/theme";
import HomeComponent from "../components/HomeComponent";
import { MainProps } from "../types";


export default function Home({ VERCEL_URL }: MainProps) {
  const theme = useRecoilValue(themeState);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline enableColorScheme />
      <Head>
        <title>Blog Fast</title>
      </Head>
      <HomeComponent VERCEL_URL={VERCEL_URL} />
    </ThemeProvider>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {
      VERCEL_URL: process.env.VERCEL_URL,
    },
  };
}
