import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:8000/",
});

// defining a custom error handler for all APIs
const errorHandler = (error: { response: { status: any }; code: string }) => {
  const statusCode = error.response?.status;

  if (error.code === "ERR_CANCELED") {
    alert("api canceled");
    return Promise.resolve();
  }

  // logging only errors that are not 401
  if (statusCode && statusCode !== 401) {
    console.error(error);
  }

  return Promise.reject(error);
};

// registering the custom error handler to the
// "api" axios instance
api.interceptors.response.use(undefined, (error) => {
  return errorHandler(error);
});
