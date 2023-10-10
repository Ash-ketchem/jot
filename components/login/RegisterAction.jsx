"use client";

import toastStore from "@/stores/toastStore";
import axios from "axios";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useCallback, useState } from "react";

const RegisterAction = ({ label }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const addToast = toastStore((state) => state.addToast);
  const handleRegister = useCallback(async () => {
    try {
      setIsLoading(true);

      const res = await axios.post("/api/register", {
        email,
        username,
        password,
      });

      if (!res?.data?.res?.id) {
        throw new Error(res?.data?.error || "something went wrong");
      }

      addToast("Loggin in...");

      const signinRes = await signIn("credentials", {
        email,
        password,
      });

      if (signinRes?.error) {
        throw new Error("Signup success but login failed");
      }

      window.location.href = "/verification";
    } catch (error) {
      console.log(error);
      // console.log(error?.response?.data?.error);
      addToast(error?.response?.data?.error || "something went wrong");
    } finally {
      setIsLoading(false);
    }
  }, [username, email, password]);

  return (
    <div className="flex flex-col gap-4 w-full ">
      <div>
        <div className="form-control w-full py-2 space-y-4 lg:pr-2">
          <div>
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              type="email"
              placeholder="Email"
              required
              value={email}
              className="input input-bordered w-full max-w-sm"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="label">
              <span className="label-text">Username</span>
            </label>
            <input
              type="text"
              required
              placeholder="Username"
              value={username}
              className="input input-bordered w-full max-w-sm"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label className="label">
              <span className="label-text">Password</span>
            </label>
            <input
              type="text"
              required
              value={password}
              placeholder="Password"
              className="input input-bordered w-full max-w-sm"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>
      </div>
      <button
        className="btn btn-primary max-w-sm"
        disabled={isLoading}
        onClick={handleRegister}
      >
        {label}
      </button>
      <div className="flex justify-center items-center">
        <p>
          Have an account ?{" "}
          <Link href="/login">
            <span className="font-semibold text-md hover:underline cursor-pointer">
              Login
            </span>
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterAction;
