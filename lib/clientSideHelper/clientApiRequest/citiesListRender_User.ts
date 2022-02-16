import urljoin from "url-join";

const citiesListRender = async (search: string, DEPLOYED_URL: string, csrfToken: string) => {
  try {
    const url = urljoin(DEPLOYED_URL, `api`, `places`, `?search=${search}`);
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ csrfToken: csrfToken }),
    });
    if (response.status !== 200 || !response.ok) {
      console.log(
        "citiesListRenderUser.ts",
        response.status,
        response.statusText,
        ((await response.json()).error)
      );
      return [];
    }
    return ((await response.json()).cities);
  } catch (err) {
    console.log("citiesListRenderUser.ts", err);
    return []
  }
};

export default citiesListRender;
