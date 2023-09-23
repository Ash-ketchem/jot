import axios from "axios";
import { useEffect, useState } from "react";

const useCurrentUser = (type) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (type) {
      const url = `/api/current?type=${type}`;
      axios
        .get(url)
        .then((response) => {
          if (response.status !== 200) {
            throw new Error("something went wrong");
          }
          setCurrentUser(response.data);
        })
        .catch((error) => {
          console.log(error);
          setError(error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [type]);

  return { data: currentUser, loading: loading, error: error };
};

export default useCurrentUser;
