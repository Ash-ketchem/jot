"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import toastStore from "@/stores/toastStore";

const LoginAction = ({ label }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const addToast = toastStore((state) => state.addToast);

  const handleLogin = useCallback(async () => {
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
      console.log(error);
      addToast("something went wrong");
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input input-bordered w-full max-w-sm"
            />
          </div>
          <div>
            <label className="label">
              <span className="label-text">Password</span>
            </label>
            <input
              type="password"
              required
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input input-bordered w-full max-w-sm"
            />
          </div>
        </div>
      </div>
      <button
        className="btn btn-primary max-w-sm"
        disabled={isLoading}
        onClick={handleLogin}
      >
        {label}
      </button>
      <div className="flex justify-center items-center">
        <p>
          Dont' have an account ?{" "}
          <Link href="/register">
            <span className="font-semibold text-md hover:underline cursor-pointer">
              Signup
            </span>
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginAction;
