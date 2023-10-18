"use client";

import toastStore from "@/stores/toastStore";
import axios from "axios";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useCallback, useState } from "react";

const RegisterAction = ({ label }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  //validation

  const [emailValid, setEmailValid] = useState(false);
  const [passValid, setPassValid] = useState(false);
  const [usernameValid, setUsernameValid] = useState(false);

  const addToast = toastStore((state) => state.addToast);

  const EmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const usernameRegex = /^[a-zA-Z0-9_.]{3,20}$/;
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

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
              pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
              value={email}
              className="input input-bordered w-full max-w-sm"
              onChange={(e) => {
                const isValid = EmailRegex.test(e.target.value);
                setEmailValid(isValid);
                setEmail(e.target.value);
              }}
            />
            <label className="label max-w-sm">
              <span className="label-text-alt"></span>
              <span
                className={`label-text-alt ${
                  email && emailValid ? "text-success" : "text-error"
                }`}
              >
                {email && emailValid ? "valid email" : email && "invalid email"}
              </span>
            </label>
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
              onChange={(e) => {
                const isValid = usernameRegex.test(e.target.value);
                setUsernameValid(isValid);
                setUsername(e.target.value);
              }}
            />
            <label className="label max-w-sm">
              <span className="label max-w-sm-text-alt"></span>
              <span
                className={`label-text-alt ${
                  username && usernameValid ? "text-success" : "text-error"
                }`}
              >
                {username && usernameValid
                  ? "valid username"
                  : username && "invalid username"}
              </span>
            </label>
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
              onChange={(e) => {
                const isValid = passwordRegex.test(e.target.value);
                setPassValid(isValid);
                setPassword(e.target.value);
              }}
            />
            <label className="label max-w-sm">
              <span className="label-text-alt"></span>
              <span
                className={`label-text-alt ${
                  password && passValid ? "text-success" : "text-error"
                }`}
              >
                {password && passValid
                  ? "valid password"
                  : password && "invalid password"}
              </span>
            </label>
          </div>
        </div>
      </div>
      <button
        className="btn btn-primary max-w-sm"
        disabled={
          isLoading ||
          !(username && password && email) ||
          !emailValid ||
          !usernameValid ||
          !passValid
        }
        onClick={handleRegister}
      >
        {label}
      </button>
      <div className="flex justify-center items-center">
        <p className="text-sm leading-relaxed -tracking-wide">
          Already have an account ?{" "}
          <Link href="/login">
            <span className="font-semibold text-md hover:underline cursor-pointer text-accent">
              Login
            </span>
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterAction;
