import getUserId from "@/libs/getUserId";
import { getServerSession } from "next-auth";
import { Inter } from "next/font/google";
import { authOptions } from "../api/auth/[...nextauth]/route";
import "@/styles/globals.css";
import Toaster from "@/components/Toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default async function RootLayout({ children }) {
  const session = await getServerSession(authOptions);

  let loggedUserId = null;

  if (session?.user?.email) {
    loggedUserId = await getUserId(session.user.email);
  }

  return (
    <html lang="en" data-theme="dark" className={inter?.className}>
      <body>
        <Toaster />
        <div className="flex justify-center items-center h-screen w-screen  flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
