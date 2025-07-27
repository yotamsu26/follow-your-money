export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
  },
  GOALS: {
    BASE: "/goals",
    BY_USER: (userId: string) => `/goals/${userId}`,
    BY_ID: (goalId: string) => `/goals/${goalId}`,
  },
  MONEY_LOCATIONS: {
    BASE: "/money-locations",
    BY_USER: (userId: string) => `/money-locations/${userId}`,
    BY_ID: (locationId: string) => `/money-locations/${locationId}`,
  },
  FILES: {
    BASE: "/files",
    BY_LOCATION: (locationId: string) => `/files/${locationId}`,
    UPLOAD: (locationId: string) => `/files/upload/${locationId}`,
    DOWNLOAD: (fileId: string) => `/files/download/${fileId}`,
    RENAME: (fileId: string) => `/files/rename/${fileId}`,
    BY_ID: (fileId: string) => `/files/${fileId}`,
  },
};
