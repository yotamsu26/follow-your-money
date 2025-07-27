import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { getItem, removeItem } from "../storage/local-storage-util";
import { MoneyLocationData } from "../types/money-location-types";
import { useApiClient } from "../contexts/ApiContext";
import { API_ENDPOINTS } from "../utils/routes";
import { STORAGE_KEYS } from "../storage/local-storage-util";
import { UserData } from "../api/auth-utils";

interface TokenPayload {
  exp?: number;
  [key: string]: any;
}

function parseUserData(): UserData | null {
  try {
    const userData = getItem(STORAGE_KEYS.USER_DATA);
    if (!userData) return null;
    return JSON.parse(userData);
  } catch (error) {
    console.error("Error parsing user data:", error);
    return null;
  }
}

function isTokenExpired(token: string): boolean {
  try {
    const tokenParts = token.split(".");
    if (tokenParts.length !== 3) return true;

    const payload: TokenPayload = JSON.parse(atob(tokenParts[1]));
    const currentTime = Date.now() / 1000;

    return !payload.exp || payload.exp < currentTime;
  } catch (error) {
    console.error("Invalid token format:", error);
    return true;
  }
}

export function useDashboard() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [moneyLocations, setMoneyLocations] = useState<MoneyLocationData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");

  const apiClient = useApiClient();

  useEffect(() => {
    loadUserData();
  }, []);

  function handleAuthFailure() {
    removeItem(STORAGE_KEYS.USER_DATA);
    router.push("/");
  }

  async function loadUserData() {
    setIsLoading(true);
    const parsedUserData = parseUserData();
    if (!parsedUserData) {
      handleAuthFailure();
      return;
    }

    if (!parsedUserData.token || isTokenExpired(parsedUserData.token)) {
      handleAuthFailure();
      return;
    }

    setUserData(parsedUserData);
    await fetchMoneyLocations(parsedUserData.userName);
    setIsLoading(false);
  }

  async function fetchMoneyLocations(userName: string) {
    try {
      const response = await apiClient.get(
        API_ENDPOINTS.MONEY_LOCATIONS.BY_USER(userName)
      );

      if (response.success) {
        setMoneyLocations(response.data || []);
      } else {
        setError(response.error || "Failed to fetch money locations");
      }
    } catch (error) {
      console.error("Error fetching money locations:", error);
      setError("Failed to fetch money locations");
    }
  }

  function handleLogout() {
    removeItem(STORAGE_KEYS.USER_DATA);
    router.push("/");
  }

  async function handleAddMoneyLocation(
    newLocationData: any,
    selectedFiles: FileList | null
  ): Promise<boolean> {
    try {
      await apiClient.post(API_ENDPOINTS.MONEY_LOCATIONS.BASE, newLocationData);

      if (selectedFiles) {
        // upload files
        const formData = new FormData();
        Array.from(selectedFiles).forEach((file) => {
          formData.append("files", file);
        });

        await apiClient.post(
          API_ENDPOINTS.FILES.UPLOAD(newLocationData.money_location_id),
          formData
        );
      }

      const currentUserData = parseUserData();
      if (currentUserData) {
        await fetchMoneyLocations(currentUserData.userName);
      }
      return true;
    } catch (error) {
      setError("Failed to add money location");
      return false;
    }
  }

  async function handleDeleteMoneyLocation(
    moneyLocationId: string
  ): Promise<boolean> {
    try {
      await apiClient.delete(
        API_ENDPOINTS.MONEY_LOCATIONS.BY_ID(moneyLocationId)
      );

      const currentUserData = parseUserData();
      if (currentUserData) {
        await fetchMoneyLocations(currentUserData.userName);
      }
      return true;
    } catch (error) {
      setError("Failed to delete money location");
      return false;
    }
  }

  async function handleUpdateMoneyLocation(
    moneyLocationId: string,
    newAmount: number,
    onGoalSync?: () => void
  ): Promise<boolean> {
    try {
      await apiClient.put(
        API_ENDPOINTS.MONEY_LOCATIONS.BY_ID(moneyLocationId),
        {
          amount: newAmount,
          last_checked: new Date().toISOString(),
        }
      );

      const currentUserData = parseUserData();
      if (currentUserData) {
        await fetchMoneyLocations(currentUserData.userName);
      }

      if (onGoalSync) {
        onGoalSync();
      }

      return true;
    } catch (error) {
      setError("Failed to update money location");
      return false;
    }
  }

  return {
    userData,
    moneyLocations,
    isLoading,
    error,
    handleLogout,
    handleAddMoneyLocation,
    handleDeleteMoneyLocation,
    handleUpdateMoneyLocation,
    setError,
  };
}
