
import { isEmpty } from "lodash";
import { NextApiRequest, NextApiResponse } from "next";
import getBlogsByCity from "../../lib/firebase/getBlogsByCity";
import { BlogPartial } from "../../types";

export default async function requestBlog(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const { city } = req.query;
  return new Promise(async (resolve) => {

    try {
      //Undefined Check
      if (city === undefined || Array.isArray(city) || city === "") {
        res.status(400).send({
          error: `URL parameter city=<NonEmptyString>`,
        });
        return resolve();
      }

      if (req.method !== "GET") {
        res.status(405).send({
          error: `Method NOT allowed. Use GET method`,
        });
        return resolve();
      }

      const blogsArray = await getBlogsByCity(city);
      //If no blogs found
      if (!blogsArray[0].isBlogExisting || blogsArray[0].blog === undefined) {
        res.status(404).send({
          error: blogsArray[0].error,
        });
        return resolve()
      }
      const blogsArrayPartial: BlogPartial[] = [];
      blogsArray.forEach(({ blog }) => {
        if (blog !== undefined) {
          blogsArrayPartial.push({
            city: String(blog?.city),
            content: String(blog?.content),
            title: String(blog?.title),
            postedOn: String(new Date(blog?.timestamp.seconds * 1000)),
            blogId: blog.blogId
          })
        }
      })
      //If blogs array complete
      res.status(200).send({
        blogsArrayPartial: blogsArrayPartial
      })
      return resolve();
    } catch (err) {
      //Catch
      console.log(err);
      res.status(500).send({ error: "Internal Server Error" });
      return resolve();
    }
  });
}

