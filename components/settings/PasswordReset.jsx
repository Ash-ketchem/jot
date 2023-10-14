"use client";

import { useCallback, useState } from "react";

const PasswordReset = () => {
  const [loading, setLoading] = useState(false);

  const [password, setPassword] = useState("");

  const handleSubmit = useCallback(() => {
    try {
      setLoading(true);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }, [password]);

  return (
    <div className="flex flex-col gap-3">
      <div className="form-control w-full">
        <label className="label">
          <span className="label-text-alt">New password</span>
        </label>
        <input
          type="text"
          placeholder="New password"
          className="input input-bordered w-full"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className="w-full flex justify-center items-center">
        <button
          className="btn btn-primary btn-sm text-primary-content lowercase tracking-wide w-[90%] text-center"
          onClick={handleSubmit}
          disabled={!password || loading}
        >
          update
        </button>
      </div>
    </div>
  );
};

export default PasswordReset;
