"use client";

import toastStore from "@/stores/toastStore";
import { EyeIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { signOut } from "next-auth/react";
import { useCallback, useRef, useState } from "react";

const PasswordReset = ({ email }) => {
  const [loading, setLoading] = useState(false);

  const passRef = useRef(null);

  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");

  const [tokenGenerated, setTokenGenerated] = useState(false);
  const addToast = toastStore((state) => state.addToast);

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const passwordValid = passwordRegex.test(password);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      try {
        setLoading(true);

        console.log(email);

        const res = await axios.post("/api/updatePassword", {
          newPassword: password,
          verificationToken: token,
          ...(email ? { email } : {}),
        });

        if (res?.status !== 200) {
          throw new Error(res?.error);
        }

        addToast("password updated successfully");

        await signOut();

        window.location.href = "/login";
      } catch (error) {
        addToast(
          error?.response?.data?.error ||
            error?.message ||
            "something went wrong"
        );

        if (error?.response?.data?.retryCount <= 0) {
          setTokenGenerated(false);
          setPassword("");
        }
      } finally {
        setLoading(false);
      }
    },
    [password, token]
  );

  const handleTokenGeneration = useCallback(
    async (e) => {
      e.preventDefault();

      try {
        setLoading(true);

        const res = await axios.post("/api/generateToken", {
          token: true,
          ...(email ? { email } : {}),
        });

        if (res?.status !== 200) {
          throw new Error(res?.error);
        }

        setTokenGenerated(true);

        addToast("Token send to registered mail sucessfully");
      } catch (error) {
        addToast(
          error?.response?.data?.error ||
            error?.message ||
            "something went wrong"
        );

        if (error?.response?.data?.retryCount) {
          setTokenGenerated(true);
        }
      } finally {
        setLoading(false);
      }
    },
    [setTokenGenerated]
  );

  return (
    <div className="flex flex-col gap-3">
      <div className="form-control w-full">
        <div>
          <label className="label">
            <span
              className={`label-text-alt ${tokenGenerated ? "" : "text-info"}`}
            >
              {tokenGenerated ? (
                <span className="flex gap-2 justify-center items-center">
                  <span className="font-semibold">New password</span>
                  <EyeIcon
                    className="w-4 h-4 cursor-pointer"
                    onClick={() => {
                      passRef.current.type =
                        passRef.current.type === "text" ? "password" : "text";
                    }}
                  />
                </span>
              ) : (
                "A token will be sent to your email address"
              )}
            </span>
            <span
              className={`label-text-alt ${
                tokenGenerated
                  ? passwordValid
                    ? "text-success"
                    : "text-error"
                  : ""
              }`}
            >
              {tokenGenerated
                ? passwordValid
                  ? "valid password"
                  : "invalid password"
                : ""}
            </span>
          </label>
          <input
            type="password"
            placeholder="New password"
            className="input input-bordered w-full"
            ref={passRef}
            value={password}
            disabled={loading || !tokenGenerated}
            onChange={(e) => setPassword(e.target.value)}
          />
          {tokenGenerated && (
            <label className="label">
              <span className="label-text-alt text-info">
                Password must be at least 8 characters long and include at least
                one lowercase letter, one uppercase letter, one digit, and one
                special character (@, $, !, %, *, ?, or &).
              </span>
            </label>
          )}
        </div>
        {tokenGenerated && (
          <div>
            <label className="label">
              <span className={`label-text-alt font-semibold`}>Token</span>
            </label>
            <input
              type="text"
              placeholder="Token"
              className="input input-bordered w-full"
              value={token}
              disabled={loading || !tokenGenerated}
              onChange={(e) => setToken(e.target.value)}
            />
          </div>
        )}
      </div>
      <div className="w-full flex justify-center items-center">
        <button
          className="btn btn-primary btn-sm text-primary-content lowercase tracking-wide w-[90%] text-center"
          onClick={tokenGenerated ? handleSubmit : handleTokenGeneration}
          disabled={(tokenGenerated ? !password || !token : false) || loading}
        >
          {tokenGenerated ? "update" : "send token"}
        </button>
      </div>
    </div>
  );
};

export default PasswordReset;
