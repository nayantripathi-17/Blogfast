import { useMediaQuery } from '@mui/material';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useCallback } from 'react';
import { loggedInSettings, loggedOutSettings, pages } from '../lib/clientSideHelper/userAndNavOptions';
import dynamic from 'next/dynamic';
import debounce from "lodash/debounce"
import CircularLoading from './CircularLoading';
import ProfileCenter from './ProfileCenter';
import TopNavbar from './TopNavbar';
import { BlogPartial, ClickHandler, MainProps } from '../types';

const DynamicMiniBlog = dynamic(() => import("./MiniBlog"), {
    loading: () => <CircularLoading />,
});


export default function ProfileComponent({ DEPLOYED_URL, blogsArray }: MainProps & { blogsArray: BlogPartial[] }) {

    const router = useRouter();
    const screenWidthSm = useMediaQuery("(max-width:599px");
    const screenWidthMd = useMediaQuery("(max-width:768px");

    //Child Component
    const sharePost = debounce(useCallback((async (blogId: string | undefined) => {
        try {
            await navigator.share({
                url: `${DEPLOYED_URL}/blog/${blogId}`,
            })
        } catch (err) {
            console.log(err)
        }
    }), [DEPLOYED_URL]),250)

    //Redirect to new blog
    const redirectToBlog = useCallback((event: ClickHandler, blogId: string | undefined) => {
        if (event.type === "click") {
            event.preventDefault();
            router.push(`${DEPLOYED_URL}/blog/${blogId}`);
        }
    }, [DEPLOYED_URL, router])

    //Truncate para
    const truncPara = (input: string) => {
        if (!screenWidthMd)
            return input.length >= 500 ? input.substring(0, 500).trim() + `...` : input;
        if (!screenWidthSm)
            return input.length >= 300 ? input.substring(0, 300).trim() + `...` : input;
        return input.length >= 200 ? input.substring(0, 200).trim() + `...` : input;
    };

    const { data: session } = useSession();
    const settings = (session ? loggedInSettings : loggedOutSettings)


    return (
        <>
            <TopNavbar settings={settings} pages={pages} session={session} />
            <main>
                <ProfileCenter session={session} />
                {blogsArray.length > 0 && (blogsArray.map((blog, index) =>
                    <DynamicMiniBlog
                        key={index} DEPLOYED_URL={DEPLOYED_URL}
                        blog={blog} truncPara={truncPara}
                        share={sharePost}
                        redirect={redirectToBlog} />
                ))}
            </main>
        </>
    )
}

