import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import CardHeader from "@mui/material/CardHeader";
import IconButton from "@mui/material/IconButton";
import ArrowCircleRight from "@mui/icons-material/ArrowCircleRight";
import ShareIcon from "@mui/icons-material/Share";
import { BlogCardMinimisedProps } from "../types";

export default function MiniBlog({ DEPLOYED_URL, blog, truncPara, share: sharePost, redirect: redirectToBlog }: BlogCardMinimisedProps) {

  
  return (
    <article className="flex flex-grow justify-center items-center mt-10">
      <Card aria-label="Mini Blog" className="w-11/12 md:w-5/6" elevation={7}>
        <CardHeader
          aria-label="Title"
          title={blog?.title ? blog?.title : "Title"}
          classes={{
            root: "pb-1 pt-10",
            content: "flex flex-grow justify-center",
            title: "text-xl md:text-2xl lg:text-3xl",
          }}
        />
        <CardHeader
          aria-label="Date Published"
          subheader={new Date(blog?.postedOn ? (blog?.postedOn) : Date.now()).toLocaleDateString("en-GB", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
          classes={{
            root: "pt-0",
            content: "flex flex-grow justify-center",
            subheader: "text-sm md:text-base lg:text-lg",
          }}
        />

        <CardContent
          aria-label="Content"
          className="p-5 pt-0 text-xs 
          sm:text-sm
          md:p-9 md:pt-0 md:text-base
          lg:p-12 lg:pt-0"
        >
          {truncPara(blog?.content ? blog?.content : "Content")}
          <CardActions
            className="pl-0 flex flex-grow justify-around"
            disableSpacing
          >
            <IconButton aria-label="Share Button" onClick={() => sharePost(blog?.blogId)}>
              <ShareIcon />
            </IconButton>
            <IconButton
              onClick={(event) => redirectToBlog(event, blog?.blogId)}
              aria-label="Open post">
              <a
                aria-label="Go to Blog"
                href={`${String(`${DEPLOYED_URL}/blog/${blog?.blogId}`)}`}
              >
                <ArrowCircleRight fontSize="large" />
              </a>
            </IconButton>
          </CardActions>
        </CardContent>
      </Card>
    </article>
  );
}
