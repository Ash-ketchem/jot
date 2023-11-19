"use client";

import toastStore from "@/stores/toastStore";
import { EyeIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { signOut } from "next-auth/react";
import { useCallback, useRef, useState } from "react";

const DeleteAccount = ({ currentEmail: email }) => {
  const [loading, setLoading] = useState(false);

  const passRef = useRef(null);

  const [token, setToken] = useState("");

  const [tokenGenerated, setTokenGenerated] = useState(false);
  const [tokenInvalid, setTokenInvalid] = useState(false);

  const addToast = toastStore((state) => state.addToast);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      try {
        setLoading(true);

        console.log(email);

        const res = await axios.delete("/api/deleteAccount", {
          data: {
            verificationToken: token,
          },
        });

        if (res?.status !== 200) {
          throw new Error(res?.error);
        }

        addToast("Account deletd successfully");

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
        }

        if (error?.response?.data?.retryCount < 3) {
          setTokenInvalid(true);
        }
      } finally {
        setLoading(false);
      }
    },
    [token]
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
                <span className="flex gap-2 justify-center items-center"></span>
              ) : (
                "A token will be sent to your email address"
              )}
            </span>
          </label>

          {tokenGenerated && (
            <label className="label">
              <span className="label-text-alt text-warning">
                Account will be deleted permenantely
              </span>
            </label>
          )}
        </div>
        {tokenGenerated && (
          <div>
            <label className="label">
              <span className={`label-text-alt font-semibold`}>Token</span>
              {tokenInvalid && (
                <span className="label-text-alt text-error font-semibold">
                  Invalid token
                </span>
              )}
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
          disabled={(tokenGenerated ? !token : false) || loading}
        >
          {tokenGenerated ? "Delete Account" : "send token"}
        </button>
      </div>
    </div>
  );
};

export default DeleteAccount;
