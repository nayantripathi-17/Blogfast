import { ThemeProvider } from "@emotion/react";
import { useRecoilValue } from "recoil";
import { themeState } from "../../atoms/theme";
import CssBaseline from "@mui/material/CssBaseline";
import Head from "next/head";
import BlogComponent from "../../components/BlogComponent";
import { getUser } from "../../lib/firebase/getUser";
import { getBlog } from "../../lib/firebase/getBlog";
import { GetStaticPaths, GetStaticProps, GetStaticPropsContext } from "next";
import { BlogProps, ParamsBlogId } from "../../types";

export default function BlogPage({ DEPLOYED_URL, blog, user, blogId }: BlogProps) {
  const theme = useRecoilValue(themeState);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline enableColorScheme />
      <Head>
        <title>Blog</title>
      </Head>
      <BlogComponent
        blog={blog}
        user={user}
        DEPLOYED_URL={DEPLOYED_URL}
        blogId={blogId}
      />
    </ThemeProvider>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: "blocking",
  };
}

export const getStaticProps: GetStaticProps = async (context: GetStaticPropsContext) => {
  try {
    const DEPLOYED_URL = process.env.DEPLOYED_URL;
    const params = context.params;
    if (params === undefined) {
      return {
        notFound: true,
        props: {
          DEPLOYED_URL,
        },
      };
    }
    const { blogId } = params;
    if (blogId === undefined || Array.isArray(blogId) || blogId === "") {
      return {
        notFound: true,
        props: {
          DEPLOYED_URL,
        },
      };
    }
    //Get Blog
    const blogData = await getBlog(blogId, {});
    if (!(blogData?.isBlogExisting) || blogData.blog === undefined) {
      return {
        notFound: true,
        props: {
          DEPLOYED_URL,
        },
      };
    }
    //Extract Author of Blog
    const blog = blogData?.blog;
    const userRes = await getUser({ userRef: blog?.subId.path });
    const user = userRes.user;
    //Returned If User Exists
    return {
      props: {
        DEPLOYED_URL: DEPLOYED_URL,
        blogId: blogId,
        blog: {
          city: blog?.city,
          content: blog?.content,
          title: blog?.title,
          postedOn: String(new Date(blog?.timestamp?.seconds * 1000)),
        },
        user: (user !== undefined ? {
          name: user?.name,
          email: user?.email,
          image: user?.image_url,
        } : user)
      },
      revalidate: 21600,
    };
  } catch (err) {
    console.log("static render [blogId]", err);
    throw err;
  }
}
