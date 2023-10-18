"use client";

import toastStore from "@/stores/toastStore";
import axios from "axios";
import { signOut } from "next-auth/react";
import { useCallback, useState } from "react";

const EmailUpdate = ({ currentEamil }) => {
  const [loading, setLoading] = useState(false);

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const [email, setEmail] = useState(currentEamil);
  const addToast = toastStore((state) => state.addToast);

  const emailValid = emailRegex.test(email) ? true : false;

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      try {
        setLoading(true);

        const res = await axios.post("/api/updateEmail", {
          email,
        });

        if (res?.status !== 200) {
          throw new Error(res?.error);
        }

        addToast("email updated successfully");
        addToast("verification token sent to mail");

        await signOut();
      } catch (error) {
        addToast(
          error?.response?.data?.error ||
            error?.message ||
            "something went wrong"
        );
      } finally {
        setLoading(false);
      }
    },
    [email]
  );

  return (
    <div className="flex flex-col gap-3">
      <div className="form-control w-full">
        <label className="label">
          <span className="label-text-alt">New Email</span>
          <span
            className={`label-text-alt ${
              email !== currentEamil
                ? emailValid
                  ? "text-success"
                  : "text-error"
                : ""
            }`}
          >
            {email !== currentEamil
              ? emailValid
                ? "valid email"
                : "invalid email"
              : ""}
          </span>
        </label>
        <input
          type="email"
          placeholder="New Email"
          className="input input-bordered w-full"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {email !== currentEamil && (
          <label className="label">
            <span className="label-text-alt text-warning">
              Please ensure you have access to your new email address. A
              verification token will be sent to complete the update process.
            </span>
          </label>
        )}
      </div>
      <div className="w-full flex justify-center items-center">
        <button
          className="btn btn-primary btn-sm text-primary-content lowercase tracking-wide w-[90%] text-center"
          onClick={handleSubmit}
          disabled={!email || email === currentEamil || loading}
        >
          update
        </button>
      </div>
    </div>
  );
};

export default EmailUpdate;
