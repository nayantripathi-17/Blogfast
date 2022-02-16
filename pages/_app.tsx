import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { AppProps } from "next/dist/shared/lib/router/router";
import { RecoilRoot } from "recoil";
import "../styles/globals.css";

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps & { pageProps: { session: Session } }) {
  try {
    return (
      <RecoilRoot>
        <SessionProvider session={session}>
          <Component {...pageProps} />
        </SessionProvider>
      </RecoilRoot>
    );
  } catch (err) {
    console.log(err);
  }
}

export default MyApp;
