import dynamic from 'next/dynamic';
import { useMediaQuery } from '@mui/material';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import debounce from 'lodash/debounce';
import { BlogPartial, ClickHandler, MainProps } from '../types';
import CircularLoading from './CircularLoading';

const DynamicMiniBlog = dynamic(() => import("./MiniBlog"), {
  loading: () => <CircularLoading />
})


export default function MiniBlogRenderer({ DEPLOYED_URL, newCityValue }: MainProps & { newCityValue: string }) {
  const [blogArray, setBlogArray] = useState<BlogPartial[]>([]);
  const screenWidthSm = useMediaQuery("(max-width:599px");
  const screenWidthMd = useMediaQuery("(max-width:768px");
  const router = useRouter();

  /* Child Component */
  //Share
  const sharePost = debounce(useCallback((async (blogId: string | undefined) => {
    try {
      await navigator.share({
        url: `${DEPLOYED_URL}/blog/${blogId}`,
      })
    } catch (err) {
      console.log(err)
    }
  }), [DEPLOYED_URL]),250)


  //Redirect to new blog
  const redirectToBlog = useCallback((event: ClickHandler, blogId: string | undefined) => {
    if (event.type === "click") {
      event.preventDefault();
      router.push(`${DEPLOYED_URL}/blog/${blogId}`);
    }
  }, [DEPLOYED_URL, router]);

  //Truncate para
  const truncPara = (input: string) => {
    if (!screenWidthMd)
      return input.length >= 500 ? input.substring(0, 500).trim() + `...` : input;
    if (!screenWidthSm)
      return input.length >= 300 ? input.substring(0, 300).trim() + `...` : input;
    return input.length >= 200 ? input.substring(0, 200).trim() + `...` : input;
  };



  //Get logs for city and render them
  useEffect(() => {
    const setBlogs = async (newCityValue: string, DEPLOYED_URL: string) => {
      if (newCityValue !== "" && newCityValue !== "null" && newCityValue !== "undefined") {
        const getBlogsArray = (await import("../lib/clientSideHelper/clientApiRequest/getBlogsArrayByCity_User")).default
        const blogsArrayPartial = await getBlogsArray(newCityValue, DEPLOYED_URL);
        setBlogArray(blogsArrayPartial);
      }
    }
    setBlogs(newCityValue, DEPLOYED_URL);
  }, [newCityValue, DEPLOYED_URL])


  return (
    <>
      {blogArray.length > 0 && (blogArray.map((blog, index) =>
        <DynamicMiniBlog
          key={index} DEPLOYED_URL={DEPLOYED_URL}
          blog={blog} truncPara={truncPara}
          share={sharePost}
          redirect={redirectToBlog} />
      ))}
    </>
  );
}

