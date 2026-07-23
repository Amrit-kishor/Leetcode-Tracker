import axios, { type AxiosInstance, type AxiosError } from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://alfa-leetcode-api.onrender.com";

/** Create a configured Axios instance */
function createApiClient(): AxiosInstance {
  const client = axios.create({
    baseURL: API_BASE_URL,
    timeout: 15000,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  // Request interceptor
  client.interceptors.request.use(
    (config) => {
      // Could add auth tokens here if needed
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor
  client.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config;

      // Retry logic for 5xx errors and network errors (max 2 retries)
      if (
        originalRequest &&
        !("_retryCount" in originalRequest)
      ) {
        (originalRequest as any)._retryCount = 0;
      }
 
      const retryCount =
        ((originalRequest as any)?._retryCount as number) ?? 0;
 
      const isRetryable =
        error.code === "ECONNABORTED" ||
        error.code === "ERR_NETWORK" ||
        (error.response && error.response.status >= 500);
 
      if (isRetryable && retryCount < 2 && originalRequest) {
        (originalRequest as any)._retryCount =
          retryCount + 1;
 
        // Exponential backoff
        const delay = Math.pow(2, retryCount) * 1000;
        await new Promise((resolve) => setTimeout(resolve, delay));
 
        return client(originalRequest);
      }

      // Handle rate limiting
      if (error.response?.status === 429) {
        const retryAfter = error.response.headers["retry-after"];
        const message = retryAfter
          ? `Rate limited. Please retry after ${retryAfter} seconds.`
          : "Rate limited. Please wait before making more requests.";
        return Promise.reject(new Error(message));
      }

      // Handle not found
      if (error.response?.status === 404) {
        return Promise.reject(new Error("User not found"));
      }

      return Promise.reject(error);
    }
  );

  return client;
}

export const apiClient = createApiClient();
