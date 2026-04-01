import axios from "axios";
import { API_URL, REQUEST_TIMEOUT } from "./env";

const instance = axios.create({
  baseURL: API_URL,
  timeout: REQUEST_TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
});

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      error.message = "Network request failed. Check your connection and try again.";
    }

    return Promise.reject(error);
  },
);

export default instance;
