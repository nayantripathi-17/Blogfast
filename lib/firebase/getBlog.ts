import { doc, getDoc } from "firebase/firestore";
import { Blog, BlogComplete, BlogData, GetBlogOptions } from "../../types";
import { initDB } from "./initDB"

export const getBlog = async (blogId: string, options: GetBlogOptions): Promise<BlogData> => {
  const db = await initDB();
  try {
    const { city } = options;
    /* If City is not provided */
    if (city === undefined) {
      const blogRef = doc(db, "blogs", String(blogId));
      const blogRefResult = await getDoc(blogRef);
      if (!blogRefResult.exists()) {
        //Return if BlogRef not found
        return {
          isBlogExisting: false,
          error: "Invalid BlogId",
        };
      }
      //If BlogRef exists
      const blogRefInCities: string = blogRefResult.data()?.blogRefInCities?.path;
      const blog = await getDoc(doc(db, blogRefInCities));
      if (!blog.exists()) {
        //Return if Blog not found
        return {
          isBlogExisting: false,
          error: "Blog not Found",
        };
      }
      //Return if Blog exists
      return ({
        blog: {
          ...blog.data() as BlogComplete,
        },
        isBlogExisting: true,
      });
    }
    /* If City is provided */
    const blogRefInCities = doc(db, "cities", city, "blogs", blogId);
    const blog = await getDoc(blogRefInCities);
    //Return if blogId invalid
    if (!blog.exists()) {
      //Return if Blog not found
      return {
        isBlogExisting: false,
        error: "Invalid BlogId/City",
      };
    }
    //Return if Blog exists
    return {
      blog: {
        ...blog.data() as BlogComplete
      },
      isBlogExisting: true,
    };
  } catch (err) {
    //catch
    console.log(err, "getCities");
    return {
      isBlogExisting: false,
      error: "Internal Server Error"
    };
  }
};
