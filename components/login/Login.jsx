import Image from "next/image";
import LoginAction from "./LoginAction";
import RegisterAction from "./RegisterAction";

const Login = ({ label, header, body, type, img }) => {
  return (
    <div className="flex justify-center items-center h-screen xl:w-[75%]  sm:w-[95%]">
      <div className="card card-side bg-base-100 shadow-sm w-[100%] h-fit">
        <div className="basis-[40%] relative hidden md:block ">
          <Image
            src={img}
            alt="image"
            fill
            className=" object-contain  p-0 mt-8 bg-blend-darken"
          />
        </div>
        <div className="card-body md:basis-[60%] basis-[100%] flex justify-center items-center lg:ml-8 ml-1">
          <div className=" lg:p-0 w-full relative  flex md:block justify-center items-center flex-col">
            <Image
              src="/images/logo.jpg"
              height={100}
              width={100}
              className="absolute h-10 w-10 rounded-full md:right-[50%] right-2 top-4 bg-blend-darken"
              alt="logo"
            />
            <h2 className="font-bold card-title tracking-wide mb-3">{label}</h2>
            <h3 className="font-medium text-md text mb-1">{header}</h3>
            <p className="text-accent mb-3">{body}</p>
            <div className="card-actions ">
              {type === "login" ? (
                <LoginAction label="Login" />
              ) : (
                <RegisterAction label="Register" />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
