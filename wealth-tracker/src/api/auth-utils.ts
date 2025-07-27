import { STORAGE_KEYS } from "../storage/local-storage-util";

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

export interface UserData {
  _id: string;
  fullName: string;
  userName: string;
  email: string;
  createdAt: string;
  token: string;
}

export const TOKEN_CONFIG = {
  HEADER_PREFIX: "Bearer ",
  PARTS_COUNT: 3,
};

interface TokenPayload {
  exp?: number;
  [key: string]: any;
}

export function getUserData(): UserData | null {
  try {
    const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
    if (!userData) return null;
    return JSON.parse(userData);
  } catch (error) {
    console.error("Failed to parse user data:", error);
    return null;
  }
}

export function getUserName(): string | null {
  const userData = getUserData();
  return userData?.userName || null;
}

export function isUserLoggedIn(): boolean {
  return getUserData() !== null;
}

export function getAuthHeaders(): Record<string, string> {
  const userData = getUserData();
  if (!userData?.token) {
    return {};
  }

  return {
    Authorization: `${TOKEN_CONFIG.HEADER_PREFIX}${userData.token}`,
  };
}

function parseJwtPayload(token: string): TokenPayload | null {
  try {
    const tokenParts = token.split(".");
    if (tokenParts.length !== TOKEN_CONFIG.PARTS_COUNT) {
      return null;
    }
    return JSON.parse(atob(tokenParts[1]));
  } catch (error) {
    console.error("Failed to parse JWT token:", error);
    return null;
  }
}

export function isTokenValid(): boolean {
  const userData = getUserData();
  if (!userData?.token) {
    return false;
  }

  const payload = parseJwtPayload(userData.token);
  if (!payload?.exp) {
    return false;
  }

  const currentTime = Date.now() / 1000;
  return payload.exp > currentTime;
}

export function isAuthError(status: number): boolean {
  return (
    status === HTTP_STATUS.UNAUTHORIZED || status === HTTP_STATUS.FORBIDDEN
  );
}
