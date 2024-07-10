import User from "@/lib/mongodb/models/User";
import { connectToDB } from "@/lib/mongodb/utils/connect";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: "credentials",
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        await connectToDB();

        if (
          credentials?.username == undefined ||
          credentials.password == undefined
        ) {
          return null;
        }

        const foundUser = await User.findOne({
          username: credentials?.username,
        });

        const isMatch = await bcrypt.compare(
          credentials?.password,
          foundUser.password
        );

        // If no error and we have user data, return it
        if (foundUser && isMatch) {
          const user = {
            id: foundUser._id.toString(),
            username: foundUser.username,
            role: foundUser.role,
            password: foundUser.password,
          };
          return user;
        }
        // Return null if user data could not be retrieved
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({
      token,
      user,
      trigger,
      session,
    }: {
      token: any;
      user?: any;
      trigger?: "signIn" | "signUp" | "update" | undefined;
      session?: any;
    }) {
      if (trigger === "update") {
        return { ...token, ...session.user };
      }
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.role = user.role;
        token.password = user.password;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      if (session?.user && token) {
        session.user.id = token.id;
        session.user.username = token.username;
        session.user.role = token.role;
        session.user.password = token.password;
      }
      return session;
    },
  },
};

export default NextAuth(authOptions);
