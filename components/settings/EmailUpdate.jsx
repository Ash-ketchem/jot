"use client";

import { useCallback, useState } from "react";

const EmailUpdate = ({ currentEamil }) => {
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState(currentEamil);

  const handleSubmit = useCallback(() => {
    try {
      setLoading(true);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }, [email]);

  return (
    <div className="flex flex-col gap-3">
      <div className="form-control w-full">
        <label className="label">
          <span className="label-text-alt">New Email</span>
        </label>
        <input
          type="text"
          placeholder="New Email"
          className="input input-bordered w-full"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
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
