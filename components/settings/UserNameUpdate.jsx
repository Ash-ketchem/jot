"use client";

import { useCallback, useState } from "react";

const UserNameUpdate = ({ currentUsername }) => {
  const [loading, setLoading] = useState(false);

  const [username, setUsername] = useState(currentUsername);

  const checkAvaialability = useCallback(() => {
    try {
      setLoading(true);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }, [username]);

  const handleSubmit = useCallback(() => {
    try {
      setLoading(true);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }, [username]);

  return (
    <div className="flex flex-col gap-3">
      <div className="form-control w-full">
        <label className="label">
          <span className="label-text-alt">New Username</span>
        </label>
        <input
          type="text"
          placeholder="New Username"
          className="input input-bordered w-full"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div className="flex justify-evenly items-center gap-4">
        <div>
          <button
            className="btn btn-info btn-sm text-info-content lowercase tracking-wide"
            onClick={checkAvaialability}
            disabled={!username || username === currentUsername || loading}
          >
            check availability
          </button>
        </div>
        <div>
          <button
            className="btn btn-primary btn-sm text-primary-content lowercase tracking-wide"
            onClick={handleSubmit}
            disabled={!username || username === currentUsername || loading}
          >
            update
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserNameUpdate;
