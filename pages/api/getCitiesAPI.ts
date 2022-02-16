import { NextApiRequest, NextApiResponse } from "next";
import { collection, getDocs } from "firebase/firestore";
import { initDB } from "../../lib/firebase/initDB";


export default async function places(req: NextApiRequest, res: NextApiResponse) {
  return new Promise<void>(async (resolve) => {
    if (req.method !== "GET") {
      res.status(405).send({
        error: `Method NOT allowed. Use GET method`,
      });
      return resolve();
    }
    res.setHeader(`Cache-Control`, `max-age=0, s-maxage=600, stale-while-revalidate=660`);

    const db = await initDB();
    try {
      //Get Collection Reference, return collection of cities
      const cities = await getDocs(collection(db, "cities"));
      if (cities.empty) {
        res.status(200).send({ arrayCities: [] });
        return resolve();
      }
      else {
        const arrayCities: string[] = [];
        cities.forEach((city) => {
          arrayCities.push(String(city.id))
        })
        res.status(200).send({ arrayCities: arrayCities })
        return resolve();
      }
    } catch (err) {
      console.log(err);
      res.status(500).send({ error: "getCitiesApi" });
      return resolve();
    }
  })
} 
