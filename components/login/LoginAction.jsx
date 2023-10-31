"use client";

import Link from "next/link";
import { useCallback, useRef, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import toastStore from "@/stores/toastStore";
import { EyeIcon } from "@heroicons/react/24/outline";

const LoginAction = ({ label }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validMail, setValidMail] = useState(false);
  const router = useRouter();

  const passRef = useRef(null);

  const addToast = toastStore((state) => state.addToast);

  const EmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleLogin = useCallback(async () => {
    if (!validMail) {
      return;
    }
    try {
      setIsLoading(true);

      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        throw new Error(res?.error);
      }

      addToast("Logging in...");

      router.refresh();
      router.push("/");
    } catch (error) {
      // console.log(error);
      addToast(
        error?.response?.data?.error || error?.message || "something went wrong"
      );
    } finally {
      setIsLoading(false);
    }
  }, [email, password, router]);

  return (
    <div className="flex flex-col gap-4 w-full  lg:pr-2">
      <div className="">
        <div className="form-control w-full py-2 space-y-4">
          <div>
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              type="email"
              required
              placeholder="Email"
              pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
              value={email}
              onChange={(e) => {
                const isValid = EmailRegex.test(e.target.value);

                setValidMail(isValid);
                setEmail(e.target.value);
              }}
              className="input input-bordered w-full max-w-sm"
            />
            <label className="label max-w-sm">
              <span className="label-text-alt"></span>
              <span
                className={`label-text-alt ${
                  email && validMail ? "text-success" : "text-error"
                }`}
              >
                {email && validMail ? "valid email" : email && "invalid email"}
              </span>
            </label>
          </div>
          <div>
            <label className="label max-w-sm">
              <span className="label-text flex gap-2 justify-center items-center">
                Password{" "}
                <EyeIcon
                  className="w-4 h-4 cursor-pointer"
                  onClick={() => {
                    passRef.current.type =
                      passRef.current.type === "text" ? "password" : "text";
                  }}
                />
              </span>
            </label>
            <input
              type="password"
              required
              placeholder="Password"
              ref={passRef}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input input-bordered w-full max-w-sm"
            />
            <label className="label max-w-sm">
              <span></span>
              <span
                className="label-text text-xs cursor-pointer leading-relaxed tracking-wide hover:text-primary underline"
                onClick={() => {
                  router.push("/passwordReset");
                }}
              >
                Forgot Password
              </span>
            </label>
          </div>
        </div>
      </div>
      <button
        className="btn btn-primary max-w-sm"
        disabled={isLoading || !(email && password) || !validMail}
        onClick={handleLogin}
      >
        {label}
      </button>
      <div className="flex justify-center items-center">
        <p className="text-sm leading-relaxed -tracking-wide">
          Dont' have an account ?{" "}
          <Link href="/register">
            <span className="font-semibold text-md hover:underline cursor-pointer text-accent">
              Signup
            </span>
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginAction;
