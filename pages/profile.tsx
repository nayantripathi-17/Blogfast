import { ThemeProvider } from "@emotion/react";
import CssBaseline from "@mui/material/CssBaseline";
import { doc, getDoc } from "firebase/firestore";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import Head from "next/head";
import { useRecoilValue } from "recoil";
import { themeState } from "../atoms/theme";
import ProfileComponent from "../components/ProfileComponent";
import { initDB } from "../lib/firebase/initDB";
import { BlogComplete, BlogPartial, MainProps, ServerSession, UserFireStoreData } from "../types";

export default function Profile({ DEPLOYED_URL, blogsArray }: MainProps & { blogsArray: BlogPartial[] }) {
  const theme = useRecoilValue(themeState);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline enableColorScheme />
      <Head>
        <title>Profile</title>
      </Head>
      <ProfileComponent DEPLOYED_URL={DEPLOYED_URL} blogsArray={blogsArray} />
    </ThemeProvider>

  );
}


export const getServerSideProps: GetServerSideProps = async (context) => {

  const DEPLOYED_URL = process.env.DEPLOYED_URL;
  const session = (await getSession(context)) as ServerSession;
  try {

    if (session === null || !session?.user?.subId) {
      return {
        notFound: true,
        props: {
          DEPLOYED_URL,
        }
      }
    }

    const db = await initDB();
    const userDetails = await getDoc(doc(db, "users", session?.user?.subId));

    if (!userDetails.exists()) {
      return {
        notFound: true,
        props: {
          DEPLOYED_URL,
        }
      }
    }

    const blogsPosted = (userDetails.data() as UserFireStoreData).blogsPosted;
    if (blogsPosted === undefined || blogsPosted.length === 0) {
      return {
        props: {
          DEPLOYED_URL,
          session,
          blogsArray: [],
        }
      }
    }

    const blogsArray: BlogPartial[] = await Promise.all(
      blogsPosted.map(async (blogRef): Promise<BlogPartial> => {
        const blogDoc = await getDoc(doc(db, blogRef.path))
        if (!blogDoc.exists()) {
          return Promise.reject([])
        }
        const blog = blogDoc.data() as BlogComplete;
        return Promise.resolve({
          blogId: blogRef.id,
          city: blog.city,
          title: blog.title,
          content: blog.content,
          postedOn: String(new Date(blog.timestamp.seconds * 1000)),
        })
      })
    )

    return {
      props: {
        DEPLOYED_URL,
        session,
        blogsArray,
      }
    }

  }
  catch (err) {
    console.trace(err, "profile.tsx")
  }
  return {
    notFound: true,
    props: {
      DEPLOYED_URL,
      session,
    }
  }
}

