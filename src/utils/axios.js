import Axios from "axios";
import Qs from "qs";
import {version} from "PackageData";
import {SESSION_ID} from "./constants";
import config from "./config";

const {LBX_API_URL, LBX_API_VERSION} = process.env;

const client = config.id.toLowerCase();
// VV https://patron.lunchbox.io OR ${LBX_API_URL} } VV
const url = `${LBX_API_URL}${LBX_API_VERSION ? `/${LBX_API_VERSION}` : ""}`;
const tokenKey = config.local_storage_key;

const AxiosInstance = Axios.create({
  baseURL: url,
  headers: {
    Client: client,
    OS: "Web Catering",
    SessionId: SESSION_ID,
    Version: version,
  },
});

AxiosInstance.defaults.withCredientials = true;
AxiosInstance.defaults.paramsSerializer = (params) =>
  Qs.stringify(params, {
    arrayFormat: "brackets",
  });

// On each request we need to send auth headers
AxiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(tokenKey);
    const {id = undefined} = JSON.parse(localStorage.getItem("location")) || {};

    const additionalHeaders = {};
    if (id) {
      additionalHeaders.locationId = id;
    }
    if (token) {
      additionalHeaders.authorization = token;
    }
    config.headers.common = {
      ...additionalHeaders,
      ...config.headers.common,
    };
    return config;
  },
  (error) => Promise.reject(error),
);

// On each response we need to grab the auth headers
// AxiosInstance.interceptors.response.use((response) => {},
// error => Promise.reject(error));

/**
 * helper method to perform an api requests
 *
 * @param path.method
 * @param path
 * @param method
 * @param data
 * @param headers
 * @param path.path
 * @param path.data
 * @param path.config
 * @returns {Promise<*>}
 */
const axiosRequest = async ({method = "GET", path, data = {}, config = {}}) => {
  try {
    method = method.toUpperCase();
    return AxiosInstance({
      method,
      url: path,
      [["GET"].includes(method) ? "params" : "data"]: data,
      ...config,
    });
  } catch (error) {
    throw error;
  }
};

const methods = {};
// Provide aliases for supported request methods
["delete", "get", "head", "options", "post", "put", "patch"].forEach(
  (method) => {
    methods[method] = (path, data, config) =>
      axiosRequest({
        config,
        data,
        method,
        path,
      });
  },
);

const handleError = (error) => {
  if (error.response) {
    const {data, status} = error.response;
    return {data: data.message, status, type: "response"};
  }
  if (error.request) {
    return {data: "No Response Received", status: 408, type: "timeout"};
  }
  return {data: error.message, status: 0, type: "request"};
};

export {axiosRequest as axios, methods, handleError};
export default axiosRequest;
