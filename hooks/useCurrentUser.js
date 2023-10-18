import axios from "axios";
import { useEffect, useRef, useState } from "react";

const useCurrentUser = (type) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isMounted = useRef(false);

  useEffect(() => {
    if (type && !isMounted?.current) {
      const url = `/api/current?type=${type}`;
      axios
        .get(url)
        .then((response) => {
          if (response.status !== 200) {
            throw new Error("something went wrong");
          }

          setCurrentUser(response.data);
          isMounted.current = true;
        })
        .catch((error) => {
          console.log(error);
          setError(error);
        })
        .finally(() => {
          setLoading(false);
        });
    }

    return () => {
      isMounted.current = false;
    };
  }, [type]);

  return { data: currentUser, loading: loading, error: error };
};

export default useCurrentUser;
