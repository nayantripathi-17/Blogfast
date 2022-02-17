import isEmpty from "lodash/isEmpty";
import { NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { addBlog } from "../../lib/firebase/addBlog";
import { verifyCsrf } from "../../lib/verifyCsrf";
import { ServerSession, SubmitBlogExtendedNextApiRequest, VerifyCsrfOptions } from "../../types";
import { collection, getDocs } from "firebase/firestore";
import { initDB } from "../../lib/firebase/initDB";

export default async function submitBlog(req: SubmitBlogExtendedNextApiRequest, res: NextApiResponse): Promise<void> {
  const { JWT_SECRET } = process.env;

  return new Promise(async (resolve) => {
    try {
      //Submit Blog
      if (req.method !== "POST") {
        res.status(405).send({
          error: `Method NOT allowed. Use POST method`,
        });
        return resolve();
      }

      if (isEmpty(req.cookies)) {
        res.status(401).send({
          error: `Cookies NOT Found!`,
        });
        return resolve();
      }
      const session = await getSession({ req }) as ServerSession;
      const subId = session?.user?.subId;

      //Due to no checking of blogs being posted, only admins can currently post blogs. This will be changed in due time as
      // verification capability is increased.
      const isAdmin = async (subId: string): Promise<boolean> => {
        const db = await initDB();
        const admins = await getDocs(collection(db, "admin"));
        if (admins.empty) return false;
        for (const admin of admins.docs) {
          if (admin.id.trim() === subId.trim()) {
            return true
          }
        }
        return false;
      }

      if (
        !(
          req.cookies["__Host-next-auth.csrf-token"] &&
          session !== null &&
          subId !== undefined &&
          (await isAdmin(subId))
        )
      ) {
        res.status(401).send({
          error: `Use valid credentials for this endpoint`,
        });
        return resolve();
      }


      if (!req.headers["content-type"]) {
        res.status(415).send({
          error: `'content-type' header missing`,
        });
        return resolve();
      }

      if (
        !String(req.headers["content-type"]).match("application/json") &&
        !String(req.headers["content-type"]).match(
          "application/x-www-form-urlencoded"
        )
      ) {
        res.status(415).send({
          error: `Valid 'content-type' : 'application/json' or 'application/x-www-form-urlencoded' `,
        });
        return resolve();
      }

      if (!req.body.csrfToken) {
        res.status(400).send({
          error: `csrfToken Missing`,
        });
        return resolve();
      }

      const csrfVerifyOptions: VerifyCsrfOptions = {
        options: { secret: String(JWT_SECRET) },
        cookieValue: req.cookies["__Host-next-auth.csrf-token"],
        isPost: true,
        bodyValue: req.body.csrfToken,
      };


      if (!(await verifyCsrf(csrfVerifyOptions)).csrfTokenVerified) {
        res.status(403).send({
          error: `csrfToken mismatch`,
        });
        return resolve();
      }

      if (
        !req.body?.title ||
        !req.body?.content ||
        !req.body?.city
      ) {
        res.status(400).send({
          error: `Body paramenter(s) invalid, Parameters : subId, csrfToken ,title, content, city`,
        });
        return resolve();
      }

      const { title, content, city } = req.body;
      const blogId = await addBlog(subId, city, { title, content });
      res.status(200).send({ blogId: blogId });
      return resolve();
    } catch (err) {
      console.log(err);
      res.status(500).send({ error: "Internal Server Error" });
      return resolve();
    }
  });
}
