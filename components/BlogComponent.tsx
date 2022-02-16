import { useSession } from "next-auth/react";
import BlogCardExpanded from "./BlogCardExpanded";
import TopNavbar from "./TopNavbar";
import { loggedInSettings, pages, loggedOutSettings } from "../lib/clientSideHelper/userAndNavOptions";
import { BlogProps } from "../types";


export default function BlogComponent({ blog, DEPLOYED_URL, user, blogId }: BlogProps) {
  const { data: session } = useSession();

  //User settings according to authentication status
  const settings = session ? loggedInSettings : loggedOutSettings;

  return (
    <>
      <TopNavbar settings={settings} pages={pages} session={session} />
      <BlogCardExpanded
        DEPLOYED_URL={DEPLOYED_URL}
        blog={blog}
        user={user}
        blogId={blogId}
      />
    </>
  );
}
