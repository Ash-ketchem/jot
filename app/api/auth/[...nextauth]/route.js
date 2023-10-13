import client from "@/libs/prismaClient";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { PrismaAdapter } from "@auth/prisma-adapter";

// let userAccount = null;

export const authOptions = {
  adapter: PrismaAdapter(client),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: {
          label: "username",
          type: "text",
        },
        password: {
          label: "password",
          type: "password",
        },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("no credentials provided");
        }

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (!emailRegex.test(credentials?.email)) {
          throw new Error("invalid email");
        }

        const user = await client.user.findUnique({
          where: {
            email: credentials.email,
          },
          select: {
            name: true,
            email: true,
            hashedPassword: true,
            emailVerified: true,

            // id: true,
          },
        });

        if (!user || !user?.hashedPassword) {
          throw new Error("invalid credentials");
        }

        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.hashedPassword
        );

        if (!isCorrectPassword) {
          throw new Error("wrong password");
        }

        // userAccount = {
        //   name: user?.name,
        //   emailVerified: user?.emailVerified,
        // };

        return {
          // workaround to include emailverified field in session
          // cannot access user object in session callback
          name: { name: user?.name, emailVerified: user?.emailVerified },
          emailVerified: user?.emailVerified,
          email: user.email,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      // if (userAccount !== null) return { ...token, ...userAccount };
      // else return token;
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          name: session?.user?.name?.name,
          emailVerified: session?.user?.name?.emailVerified,
        },
      };
    },
  },

  debug: process.env.NODE_ENV === "development",
  session: {
    strategy: "jwt",
  },
  jwt: {
    secret: process.env.NEXTAUTH_JWT_SECRET,
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
