import {
  Client,
  PlaceAutocompleteType,
} from "@googlemaps/google-maps-services-js";
import isEmpty from "lodash/isEmpty";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { verifyCsrf } from "../../lib/verifyCsrf";
import { ServerSession } from "../../types";

export default async function places(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const { API_KEY_GOOGLE_MAPS, JWT_SECRET } = process.env as { [key: string]: string };
  const { search } = req.query;
  return new Promise(async (resolve) => {
    try {
      //Autocomplete Post

      if (search === undefined || search === "" || search === "undefined" || Array.isArray(search)) {
        res.status(400).send({
          error: `URL parameter search=<NonEmptyString>`,
        });
        return resolve();
      }

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
      if (
        !(
          req.cookies["__Host-next-auth.csrf-token"] &&
          session !== null
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
        !String(req.headers["content-type"]).match("application/x-www-form-urlencoded")
      ) {
        res.status(415).send({
          error: `Valid 'content-type' : 'application/json' or 'application/x-www-form-urlencoded' `,
        });
        return resolve();
      }

      if (!req.body?.csrfToken) {
        res.status(400).send({
          error: `csrfToken Missing`,
        });
        return resolve();
      }

      const csrfVerifyOptions = {
        options: { secret: JWT_SECRET },
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

      const client = new Client({});
      const paramOptions = {
        input: search,
        types: PlaceAutocompleteType.cities,
        key: API_KEY_GOOGLE_MAPS,
      };

      const { data: { predictions }, } = await client.placeAutocomplete({
        params: paramOptions,
      });
      const cities: string[] = [];
      predictions.forEach(({ description }) => {
        cities.push(description);
      });
      res.status(200).send({ cities });
      return resolve();
    } catch (err) {
      console.log(err);
      res.status(500).send({ error: "Internal Server Error" });
      return resolve();
    }
  });
}
