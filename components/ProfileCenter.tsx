import Paper from "@mui/material/Paper"
import Avatar from "@mui/material/Avatar"
import { Session } from "next-auth"
import ProfileTextField from "./ProfileTextField"
import { ThemeProvider } from "@emotion/react";
import { darkTheme } from "../atoms/theme";

function ProfileCenter({ session }: { session: Session | null }) {

    return (
        <form className="flex flex-grow justify-center items-center mt-10">
            <Paper aria-label="User Profile" className="m-5 p-5 pt-15 justify-center w-11/12 h-full" elevation={7}>
                <ThemeProvider theme={darkTheme}>
                    <section className="flex flex-grow justify-center">
                        <Avatar
                            src={session?.user?.image ? session?.user?.image : ""}
                            aria-label="User profile Photo"
                            alt="Profile Photo"
                            className="text-2xl w-20 h-20 lg:w-32 lg:h-32 lg:text-4xl"
                        >
                            {String(session?.user?.name ? session?.user?.name : "User")
                                .substring(0, 1)
                                .toUpperCase()}
                        </Avatar>
                    </section>
                </ThemeProvider>
                <div className="flex justify-center items-center ">
                    <ProfileTextField startValue={String(session?.user?.name)} label={"Name"} />
                </div>
                <div className="flex justify-center items-center ">
                    <ProfileTextField startValue={String(session?.user?.email)} label={"Email"} />
                </div>
            </Paper>
        </form>
    )
}

export default ProfileCenter