import Login from "@/components/login/Login";
import getSession from "@/libs/getSession";
import { redirect } from "next/navigation";

const page = async () => {
  if (await getSession()) {
    redirect("/");
  }
  return (
    <Login
      label="Register"
      header="Join for free!"
      body="Connecting minds, one post at a time"
      type="register"
      img="/images/register.svg"
    />
  );
};

export default page;
