import { useEffect, useState } from "react";
import axios from "axios";

const useFetch = (endpoint, options = {}, autoLoad = true) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No token found");
      return;
    }

    setLoading(true);
    try {
      const response = await axios({
        url: `${process.env.REACT_APP_API_URL}${endpoint}`,
        method: options.method || "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          ...options.headers,
        },
        data: options.body || null,
        params: options.params || null,
      });

      setData(response.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (autoLoad) fetchData();
  }, [endpoint]);

  return { data, error, loading, refetch: fetchData };
};

export default useFetch;
