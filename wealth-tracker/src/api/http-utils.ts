import { HTTP_STATUS } from "./auth-utils";
import { isTokenValid, getAuthHeaders } from "./auth-utils";

export const CONTENT_TYPES = {
  JSON: "application/json",
  OCTET_STREAM: "application/octet-stream",
};

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: any;
  requiresAuth?: boolean;
}

export function isFileDownloadResponse(response: Response): boolean {
  const contentType = response.headers.get("content-type");
  const contentDisposition = response.headers.get("content-disposition");

  return !!(
    contentType?.includes(CONTENT_TYPES.OCTET_STREAM) ||
    contentDisposition?.includes("attachment")
  );
}

export function buildHeaders(options: RequestOptions): Record<string, string> {
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  if (options.body && !(options.body instanceof FormData)) {
    headers["Content-Type"] = CONTENT_TYPES.JSON;
  }

  if (options.requiresAuth !== false) {
    if (!isTokenValid()) {
      throw new Error("Invalid authentication token");
    }
    Object.assign(headers, getAuthHeaders());
  }

  return headers;
}

export function buildRequestBody(body: any): string | FormData | undefined {
  if (body === undefined) return undefined;
  if (body instanceof FormData) return body;
  return typeof body === "string" ? body : JSON.stringify(body);
}

export async function handleResponse<T>(
  response: Response,
  onAuthFailure: () => void
): Promise<ApiResponse<T>> {
  if (
    response.status === HTTP_STATUS.UNAUTHORIZED ||
    response.status === HTTP_STATUS.FORBIDDEN
  ) {
    onAuthFailure();
    return { success: false, error: "Authentication required" };
  }

  if (!response.ok) {
    try {
      const errorData = await response.json();
      return {
        success: false,
        error: errorData.message || `HTTP ${response.status}`,
      };
    } catch {
      return {
        success: false,
        error: `HTTP ${response.status}`,
      };
    }
  }

  if (isFileDownloadResponse(response)) {
    const blob = await response.blob();
    return { success: true, data: blob as unknown as T };
  }

  const data = await response.json();
  return data;
}
