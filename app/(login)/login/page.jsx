import Login from "@/components/login/Login";
import getSession from "@/libs/getSession";
import { redirect } from "next/navigation";

const page = async () => {
  if (await getSession()) {
    redirect("/");
  }

  return (
    <Login
      label="Login"
      header="Welocme back!"
      body="Connecting minds, one post at a time"
      type="login"
      img="/images/socialMedia.svg"
    />
  );
};

export default page;
