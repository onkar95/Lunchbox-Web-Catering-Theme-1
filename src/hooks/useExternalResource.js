import {useEffect, useState} from "react";
import axios from "axios";

const useExternalResource = ({path, method = "get", data = {}}) => {
  const [fetching, setFetching] = useState(true);
  const [resource, setResource] = useState([]);
  const [error, setError] = useState({});
  const request = async () => {
    try {
      const apiResponse = await axios[method](path, data);
      setResource(apiResponse.data);
    } catch (e) {
      setError(e);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    request();
  }, []);

  return {
    error,
    fetching,
    request,
    resource,
  };
};

export default useExternalResource;
