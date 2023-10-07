import getSession from "@/libs/getSession";
import { redirect } from "next/navigation";

const page = async () => {
  if (await getSession()) {
    redirect("/");
  }
  return <div>verifiy page</div>;
};

export default page;
