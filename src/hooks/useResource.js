import {useEffect, useState} from "react";
import {axios} from "../utils";

const {methods, handleError} = axios;
const useResource = (
  {path, method = "get", data = {}, headers = {}},
  fetchOnMount = true,
) => {
  const [callCount, setCallCount] = useState(0);
  const [fetching, setFetching] = useState(true);
  const [resource, setResource] = useState([]);
  const [error, setError] = useState({});
  const request = async (data) => {
    try {
      const apiResponse = await methods[method](path, data, {headers});
      setResource(apiResponse.data);
      setCallCount(callCount + 1);
    } catch (e) {
      setError(handleError(e));
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    if (!callCount && !fetchOnMount) {
      return;
    }
    request(data);
  }, []);

  return {
    error,
    fetching,
    request,
    resource,
  };
};

export default useResource;
