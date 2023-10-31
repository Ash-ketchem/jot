"use client";

import toastStore from "@/stores/toastStore";
import userStore from "@/stores/userStore";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

const UserNameUpdate = ({ currentUsername }) => {
  const usernameRegex = /^[a-zA-Z0-9_.]{3,20}$/;

  const [loading, setLoading] = useState(false);

  const addToast = toastStore((state) => state.addToast);

  const [username, setUsername] = useState(currentUsername);

  const [usernameAvailable, setUserNameAvaialble] = useState(null);

  const setUserData = userStore((state) => state.setUserData);

  const router = useRouter();

  const usernameValid = usernameRegex.test(username);

  const checkAvaialability = useCallback(
    async (e) => {
      e.preventDefault();
      try {
        setLoading(true);

        const res = await axios.post("/api/usernameAvailable", {
          username: username,
        });

        if (res?.status !== 200) {
          throw new Error(res?.error);
        }

        setUserNameAvaialble(res?.data?.usernameAvailable);
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
    [username]
  );

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      try {
        setLoading(true);
        const res = await axios.post("/api/updateUsername", {
          username,
        });

        if (res?.status !== 200) {
          throw new Error(res?.error);
        }

        addToast("username changed successfully");
        setUserNameAvaialble(null);
        setUserData({
          username: username,
        });
        // setUsername(username);

        router.refresh();
        // window.location.reload();
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
    [username, router, setUserData]
  );

  return (
    <div className="flex flex-col gap-3">
      <div className="form-control w-full">
        <label className="label">
          <span
            className={`label-text-alt ${
              usernameAvailable === true && " text-success"
            } ${usernameAvailable === false && "text-error"}`}
          >
            {usernameAvailable === null
              ? "New Username"
              : usernameAvailable
              ? "Username available"
              : "Username already taken"}
          </span>
          <span
            className={`label-text-alt
           ${
             username !== currentUsername
               ? usernameValid
                 ? "text-success"
                 : "text-error"
               : ""
           }`}
          >
            {username !== currentUsername
              ? usernameValid
                ? "valid format"
                : "invalid format"
              : ""}
          </span>
        </label>
        <input
          type="text"
          placeholder="New Username"
          className="input input-bordered w-full"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <label className="label">
          <span className="label-text-alt text-info">
            Username must be 3 to 20 characters long and can contain letters
            (both uppercase and lowercase), numbers, underscores (_), and dots
            (.)
          </span>
        </label>
      </div>
      <div className="flex justify-evenly items-center gap-4">
        <div>
          <button
            className="btn btn-info btn-sm text-info-content lowercase tracking-wide"
            onClick={checkAvaialability}
            disabled={
              !username ||
              username === currentUsername ||
              loading ||
              !usernameValid
            }
          >
            check availability
          </button>
        </div>
        <div>
          <button
            className="btn btn-primary btn-sm text-primary-content lowercase tracking-wide"
            onClick={handleSubmit}
            disabled={
              !username ||
              username === currentUsername ||
              loading ||
              !usernameValid
            }
          >
            update
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserNameUpdate;
