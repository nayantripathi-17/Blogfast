import urljoin from "url-join";
import { BlogPartial } from "../../../types";

const getBlogsArrayByCity = async (city: string, DEPLOYED_URL: string): Promise<BlogPartial[]> => {
    try {
        const url = urljoin(DEPLOYED_URL, `api`, `requestBlogsByCity`, `?city=${city}`);
        const response = await fetch(url, {
            method: "GET",
        });
        if (response.status === 404) {
            return [];
        }
        if (response.status !== 200 || !response.ok) {
            console.log(
                "getBlogsArrayUser.ts",
                response.status,
                response.statusText,
                ((await response.json()).error)
            );
            return [];
        }
        return ((await response.json()).blogsArrayPartial as BlogPartial[]);
    } catch (err) {
        console.log("getBlogsArrayUser.ts", err);
        return []
    }
};

export default getBlogsArrayByCity;
