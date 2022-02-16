import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import CardHeader from "@mui/material/CardHeader";
import ShareIcon from "@mui/icons-material/Share";
import { BlogProps } from "../types";
import { useCallback } from "react";
import debounce from "lodash/debounce"

export default function BlogCardExpanded({ blog, DEPLOYED_URL, user, blogId }: BlogProps) {


  const sharePost = debounce(useCallback((async () => {
    try {
      await navigator.share({
        url: `${DEPLOYED_URL}/blog/${blogId}`,
      })
    } catch (err) {
      console.log(err)
    }
  }), [DEPLOYED_URL, blogId]),250)

  return (
    <article aria-label="Blog Post" className="flex flex-grow justify-center items-center mt-10">
      <Card className="m-5 p-5 justify-center w-11/12 h-full" elevation={7}>
        <section className="flex flex-grow justify-center">
          <Avatar
            src={user?.image ? user?.image : ""}
            aria-label="name"
            alt="Author Photo"
            className="text-2xl w-14 h-14 lg:w-20 lg:h-20 lg:text-4xl"
          >
            {String(user?.name ? user?.name : "Author")
              .substring(0, 1)
              .toUpperCase()}
          </Avatar>
        </section>

        <CardHeader
          aria-label="Author's name and email"
          classes={{
            title:
              "text-sm md:text-base lg:text-lg flex flex-grow justify-center",
            subheader:
              "text-xs md:text-sm lg:text-base flex flex-grow justify-center",
          }}
          title={user?.email ? user?.name : "Author"}
          subheader={user?.name ? user?.email : "Username"}
        />
        <CardHeader
          aria-label="Title"
          classes={{
            root: "pb-1 pt-0",
            content: "flex flex-grow justify-center",
            title: "text-xl md:text-2xl lg:text-3xl",
          }}
          title={blog?.title ? blog?.title : "Title"}
        />
        <CardHeader
          classes={{
            root: "pt-0",
            content: "flex flex-grow justify-center",
            subheader: "text-sm md:text-base lg:text-lg",
          }}
          subheader={
            new Date(blog?.postedOn ? String(blog?.postedOn) : Date.now()).toLocaleDateString("en-GB", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })
          }
        />

        <CardContent
          className="p-5 pt-0
          whitespace-pre-line
          text-xs
          md:p-9 md:pt-0 md:text-base
          lg:p-12 lg:pt-0 "
        >
          {blog?.content ? blog?.content : "Content"}
          <CardActions
            className="pl-0 flex flex-grow justify-end"
            disableSpacing
          >
            <IconButton aria-label="Share Button" onClick={sharePost}>
              <ShareIcon />
            </IconButton>
          </CardActions>
        </CardContent>
      </Card>
    </article>
  );
}
