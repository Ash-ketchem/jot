import client from "@/libs/prismaClient";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { PrismaAdapter } from "@auth/prisma-adapter";

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
          throw new Error("invalid email ");
        }

        const user = await client.user.findUnique({
          where: {
            email: credentials.email,
          },
          select: {
            name: true,
            email: true,
            hashedPassword: true,
            // id: true,
          },
        });

        if (!user || !user?.hashedPassword) {
          throw new Error("invalid credentials 1");
        }

        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.hashedPassword
        );

        if (!isCorrectPassword) {
          throw new Error("wrong password");
        }

        return {
          // id: user.id,
          username: user.username,
          email: user.email,
        };
      },
    }),
  ],
  debug: process.env.NODE_ENV === "development",
  session: {
    strategy: "jwt",
  },
  jwt: {
    secret: process.env.NEXTAUTH_JWT_SECRET,
  },
  secret: process.env.NEXTAUTH_SECRET,

  // callbacks: {
  //  async signIn({ user, account, profile, email, credentials }) {
  //   return true;
  //  },
  // },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
