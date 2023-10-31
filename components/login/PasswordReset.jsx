"use client";

import toastStore from "@/stores/toastStore";
import axios from "axios";
import { useCallback, useState } from "react";
import PasswordResetSettings from "../settings/PasswordReset";

const PasswordReset = () => {
  const EmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [emailValid, setEmailValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [userExists, setUserExists] = useState(false);

  const addToast = toastStore((state) => state.addToast);

  const handleSubmit = useCallback(async () => {
    try {
      setIsLoading(true);

      const res = await axios.post("/api/userExists", {
        email,
      });

      if (res?.status !== 200) {
        throw new Error(res?.error);
      }

      const userExists = res?.data?.userExists;

      if (userExists) {
        addToast("User exists with this email address");
        setUserExists(true);
      } else {
        addToast("No user exists with this email address");
      }
    } catch (error) {
      addToast(error?.response?.data?.error || "something went wrong");
    } finally {
      setIsLoading(false);
    }
  }, [email]);

  if (userExists) {
    return (
      <div className="flex flex-col gap-4 w-full justify-center items-center max-w-xl overflow-y-hidden">
        <h3 className="font-semibold text-lg leading-relaxed tracking-wider">
          Reset Password
        </h3>
        <PasswordResetSettings email={email} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 w-full justify-center items-center overflow-y-hidden h-[60vh]">
      <div>
        <div className="form-control w-full py-2 space-y-4 lg:pr-2">
          {/* email */}
          <div>
            <label className="label">
              <span className="label-text font-semibold">Email</span>
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
        </div>
      </div>
      <button
        className="btn btn-primary max-w-sm"
        disabled={isLoading || !email || !emailValid}
        onClick={handleSubmit}
      >
        reset password
      </button>
    </div>
  );
};

export default PasswordReset;
