import { ThemeProvider } from "@emotion/react";
import CssBaseline from "@mui/material/CssBaseline";
import { useRecoilValue } from "recoil";
import { themeState } from "../atoms/theme";
import Head from "next/head";
import LoginComponent from "../components/LoginComponent";

export default function Login() {
  const theme = useRecoilValue(themeState);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline enableColorScheme />
      <Head>
        <title>Login</title>
      </Head>
      <LoginComponent />
    </ThemeProvider>

  );
}

export async function getStaticProps() {
  return {
    props: {
      DEPLOYED_URL: process.env.DEPLOYED_URL,
    },
  };
}