import { TextFieldProps } from "@mui/material";
import { DocumentData, DocumentReference } from "firebase/firestore";
import { DebouncedFunc } from "lodash";
import { NextApiRequest } from "next";
import { Session } from "next-auth";;
import { Dispatch, MouseEventHandler, SetStateAction } from "react";


/* React Components */
//All Main Components
export declare interface MainProps {
    DEPLOYED_URL: string,
}
export type ServerSession = (Session & { user: UserObject }) | null

//NavBar
export declare interface NavbarProps {
    settings?: string[],
    pages?: string[],
    session: ServerSession | Session | null
}
//Menu Options
export declare interface MenuOptionsProps {
    menuOptions: string[],
    anchorMenu: HTMLElement | null,
    closeMenu: () => void
    clickedMenuOption: (menuOption: string) => void
}
//Searchbar Component
export declare interface SearchbarProps extends MainProps {
    value: string | null,
    setValue: Dispatch<SetStateAction<string>>
    selectClick: MouseEventHandler<HTMLButtonElement>
}
//Autocomplete Component
export declare interface AutocompleteCitiesProps extends MainProps {
    cityValue: React.Dispatch<React.SetStateAction<string>>
}
//BlogCardMinimised
export declare interface BlogCardMinimisedProps extends MainProps {
    blog: BlogPartial,
    truncPara: (input: string) => string,
    share: DebouncedFunc<(blogId: string | undefined) => Promise<void>>,
    redirect: (event: ClickHandler, blogId: string | undefined) => void
}

//TextField
export type TextFieldValueChangeEvent = React.ChangeEvent & {
    target: {
        value: string
    }
};
export type TextFieldValueChangeHandler = React.ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement>;
export type CustomTextFieldPropsAndHandlers = TextFieldProps & {
    textValue: string,
    calculateTextLength: TextFieldValueChangeHandler
}

//Submit Button
export declare interface SubmitButtonProps {
    isSubmitted: boolean,
    isLoading: boolean
}
export type FormSubmitHandler = React.FormEvent;
export type ClickHandler = React.MouseEvent<HTMLElement>;


//Profile
export type ProfileTextFieldProps = CustomTextFieldPropsAndHandlers & {
    isDisabled: boolean
}

export declare interface UserFireStoreData extends DocumentData {
    blogsPosted: DocumentReference[] | undefined
    email: string,
    image_url: string,
    isEmailVerified: boolean,
    name: string,
    timestamp: {
        seconds: number,
        nanoseconds: number
    }
}


/* API and Library */
/* Library */
//addBlog
export declare interface addBlogOptions {
    csrfToken?: string,
    title: string,
    content: string
}
//postBlog
export type PostBlogOptions = {
    title: string,
    content: string,
    csrfToken: string,
    city: string,
}
//submitBlogAPI
export declare interface SubmitBlogExtendedNextApiRequest extends NextApiRequest {
    body: PostBlogOptions
}
//vertifyCsrf
export declare interface VerifyCsrfOptions {
    options: {
        secret: string,
    };
    cookieValue: string;
    isPost: boolean;
    bodyValue: any;
}


/* Library/Firebase */
//getUser
export declare interface GetUserOptions {
    subId?: string,
    userRef?: string
}
export type UserObject = {
    name: string,
    email: string,
    isEmailVerified?: boolean,
    image?: string,
    image_url?: string,
    subId?: string
} | undefined


//getBlog
export declare interface GetBlogOptions {
    city?: string
}
export type Blog = {
    city: string,
    title: string,
    content: string,
}
export type BlogComplete = Blog & {
    subId: {
        path: string,
    },
    blogId?: string,
    timestamp: {
        seconds: number,
        nanoseconds: number
    }
}
export type BlogPartial = Blog & {
    postedOn: string,
    blogId?: string
}
export type BlogData = {
    isBlogExisting: boolean,
    blog?: BlogComplete
    error?: string
}


/*Pages*/
//blog/[blogId].js
export declare interface ParamsBlogId {
    params: {
        blogId: string | undefined
    }
}
export declare interface BlogProps extends MainProps {
    blog: Blog & {
        postedOn: string
    },
    user: UserObject,
    blogId: string,
}
