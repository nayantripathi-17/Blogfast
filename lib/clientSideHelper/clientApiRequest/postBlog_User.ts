import urljoin from "url-join";
import { PostBlogOptions } from "../../../types";

const postBlog = async (options: FormData, DEPLOYED_URL: string): Promise<string> => {
  const url = urljoin(DEPLOYED_URL, `api`, `submitBlog`);
  try {
    const optionsObject: PostBlogOptions = Object.fromEntries(options.entries()) as PostBlogOptions;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams(optionsObject).toString(),
    });
    if (response.status != 200 || !response.ok) {
      console.log(
        "postBlog.js",
        response.status,
        response.statusText,
        (await response.json()).error
      );
      return "";
    }
    return (await response.json()).blogId;
  } catch (err) {
    console.log("postBlog.js", err);
    return "";
  }
};

export default postBlog;
