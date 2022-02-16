import NextAuth, { Session, TokenSet } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import urljoin from "url-join";
import { addUser } from "../../../lib/firebase/addUser";
import { getUser } from "../../../lib/firebase/getUser";
import { UserObject } from "../../../types";

const {
  DEPLOYED_URL,
  CLIENT_ID_GOOGLE_OAUTH,
  CLIENT_SECRET_GOOGLE_OAUTH,
  JWT_SECRET,
} = process.env;

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: String(CLIENT_ID_GOOGLE_OAUTH),
      clientSecret: String(CLIENT_SECRET_GOOGLE_OAUTH),
      authorization: {
        params: {
          scope: "openid email profile",
          redirect_uri: urljoin(
            String(DEPLOYED_URL),
            `api`,
            `auth`,
            `callback`,
            `google`
          ),
        },
      },
    }),
  ],
  secret: JWT_SECRET,
  session: {
    maxAge: 1 * 24 * 60 * 60,
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    //@ts-ignore
    async signIn({ profile }) {
      try {
        //Expired Id token
        if (Date.now() > Number(new Date(Number(profile?.exp) * 1000))) return false;

        /*Normal Authentication Flow*/
        //Existing User
        const userInfo = await getUser({ subId: profile?.sub });
        if (userInfo.isUserExisting) {
          return true;
        }
        /*New User*/
        //Create object to pass
        const userObj: UserObject = {
          name: String(profile?.name),
          email: String(profile?.email),
          image_url: String(profile?.picture),
          isEmailVerified: Boolean(profile?.email_verified),
        };
        //Add User
        addUser(profile?.sub, userObj);
        return true;
      } catch (err) {
        //catch block
        console.log("error", err);
      }
    },

    //@ts-ignore
    async jwt({ token, profile, account }) {
      try {
        //New login
        if (account && profile) {
          return {
            ...token,
            google_expiring_at: Number(profile.exp) * 1000,
            isEmailVerified: profile.email_verified,
          };
        } else {
          return token;
        }
      } catch (err) {
        console.log("error", err);
      }
    },
    async session({ session, token }: { session: Session, token: TokenSet }) {
      //@ts-ignore
      session.user.image = String(token?.picture);
      //@ts-ignore
      session.user.subId = String(token?.sub);
      //@ts-ignore
      session.user.isEmailVerified = Boolean(token?.isEmailVerified);

      return session;
    },
  },
});
