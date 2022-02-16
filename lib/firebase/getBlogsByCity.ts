import { collection, getDocs } from "firebase/firestore";
import { BlogComplete, BlogData, } from "../../types";
import { initDB } from "./initDB"

const getBlogsByCity = async (city: string): Promise<BlogData[]> => {
    const db = await initDB();
    try {
        /* If City is not provided */
        if (city === undefined || city === "undefined") {
            return [{
                isBlogExisting: false,
                error: "City not provided"
            }]
        }
        /* If City is provided */
        const blogs = await getDocs(collection(db, "cities", city, "blogs"));
        if (blogs.empty) {
            return [{
                isBlogExisting: false,
                error: "404 Blogs not found"
            }]
        }

        const blogsArray: BlogData[] = []
        blogs.forEach((blog) => {
            blogsArray.push({
                isBlogExisting: true,
                blog: {
                    ...blog.data() as BlogComplete,
                    blogId: blog.id
                }
            })
        })
        return blogsArray;
        // return blogsArray
    } catch (err) {
        //catch
        console.log(err, "getCities");
        return [{
            isBlogExisting: false,
            error: "Internal Server Error"
        }];
    }
};

export default getBlogsByCity;
