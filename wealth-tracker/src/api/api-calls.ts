import { isTokenValid, isAuthError } from "./auth-utils";
import {
  buildHeaders,
  buildRequestBody,
  handleResponse,
  RequestOptions,
  ApiResponse,
} from "./http-utils";

interface ApiClientConfig {
  baseUrl?: string;
  onAuthFailure?: () => void;
}

export function createApiClient(config: ApiClientConfig = {}) {
  const baseUrl = config.baseUrl || "http://localhost:3020";
  const onAuthFailure = config.onAuthFailure || (() => {});

  function handleAuthError(): ApiResponse {
    onAuthFailure();
    return { success: false, error: "Authentication required" };
  }

  async function request<T = any>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const url = endpoint.startsWith("http")
      ? endpoint
      : `${baseUrl}${endpoint}`;

    try {
      const headers = buildHeaders(options);
      const body = buildRequestBody(options.body);

      const requestConfig: RequestInit = {
        ...options,
        headers,
        body,
      };

      const response = await fetch(url, requestConfig);
      return await handleResponse<T>(response, onAuthFailure);
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === "Invalid authentication token"
      ) {
        return handleAuthError();
      }

      console.error("API request failed:", error);
      return {
        success: false,
        error: "Network error. Please try again.",
      };
    }
  }

  async function downloadFile(
    endpoint: string,
    options: Omit<RequestOptions, "method"> = {}
  ) {
    const url = endpoint.startsWith("http")
      ? endpoint
      : `${baseUrl}${endpoint}`;

    try {
      const headers = buildHeaders({ ...options, requiresAuth: true });

      const response = await fetch(url, {
        ...options,
        method: "GET",
        headers,
      });

      if (isAuthError(response.status)) {
        throw new Error("Authentication failed");
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      return response;
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === "Invalid authentication token"
      ) {
        onAuthFailure();
      }
      throw error;
    }
  }

  return {
    get: <T = any>(
      endpoint: string,
      options: Omit<RequestOptions, "method"> = {}
    ) => request<T>(endpoint, { ...options, method: "GET" }),

    post: <T = any>(
      endpoint: string,
      body?: any,
      options: Omit<RequestOptions, "method" | "body"> = {}
    ) => request<T>(endpoint, { ...options, method: "POST", body }),

    put: <T = any>(
      endpoint: string,
      body?: any,
      options: Omit<RequestOptions, "method" | "body"> = {}
    ) => request<T>(endpoint, { ...options, method: "PUT", body }),

    delete: <T = any>(
      endpoint: string,
      options: Omit<RequestOptions, "method"> = {}
    ) => request<T>(endpoint, { ...options, method: "DELETE" }),

    downloadFile,
    request,
  };
}
