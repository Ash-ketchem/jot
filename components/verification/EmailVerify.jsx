"use client";

import toastStore from "@/stores/toastStore";
import axios from "axios";
import { signOut } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";

const EmailVerify = ({ email, retryAttemptsLeft }) => {
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [attemptsLeft, setAttemptsLeft] = useState(retryAttemptsLeft);

  const addToast = toastStore((state) => state.addToast);

  const handleChange = useCallback(
    (e) => {
      setToken(e.target.value);
    },
    [setToken]
  );

  const handleVerification = useCallback(async () => {
    try {
      setLoading(true);

      const res = await axios.post("/api/verify", {
        token: token,
      });

      if (res?.error) {
        throw new Error(res?.error);
      }

      //signout

      await signOut();
    } catch (error) {
      // console.log(error);
      addToast(
        error?.response?.data?.error || error?.message || "something went wrong"
      );

      if (parseInt(error?.response?.data?.retryCount) >= 0) {
        setAttemptsLeft(error?.response?.data?.retryCount);
      }
    } finally {
      setLoading(false);
    }
  }, [token, setLoading]);

  useEffect(() => {
    (async function destroySession() {
      if (attemptsLeft <= 0) await signOut();
    })();
  }, [attemptsLeft]);

  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="card lg:w-6/12 md:w-2/3 w-[90%] md:h-2/3 h-[90%]   bg-base-100 shadow-xl">
        <div className="card-body space-y-4">
          <h2 className="card-title flex justify-center items-center p-2 w-full">
            Verify Email address
          </h2>
          <div>
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              type="text"
              placeholder="Type here"
              className="input input-bordered  w-full"
              value={email}
              disabled={true}
            />
          </div>
          <div>
            <label className="label">
              <span className="label-text">Token</span>
            </label>
            <input
              type="text"
              placeholder="token"
              className="input input-bordered input-primary w-full "
              value={token}
              onChange={handleChange}
              disabled={loading || retryAttemptsLeft === 0}
            />
            <label className="label">
              <span className="label-text-alt text-info">
                After 3 failed attempts account will get deleted
              </span>
              <span className="label-text-alt text-error">
                {attemptsLeft} attempts left
              </span>
            </label>
          </div>
          <div className="card-actions justify-center">
            <button
              className="btn btn-primary lowercase leading-loose tracking-wider"
              onClick={handleVerification}
              disabled={loading || retryAttemptsLeft === 0}
            >
              Verify
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerify;
