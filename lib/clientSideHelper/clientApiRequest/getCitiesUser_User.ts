import urljoin from "url-join";

export const getCities = async (DEPLOYED_URL: string): Promise<string[]> => {
  const url = urljoin(DEPLOYED_URL, `api`, `getCitiesAPI`);
  try {
    const response = await fetch(url, { method: "GET" });
    if (response.status !== 200) {
      console.log("getCitiesUser.ts",
        response.status,
        response.statusText,
        (await response.json()).error);
      return [];
    }
    const arrayCities: string[] = (await response.json()).arrayCities;
    return arrayCities;
  }
  catch (err) {
    //catch
    console.log(err, "getCitiesUser.ts");
    return [];
  }
};
