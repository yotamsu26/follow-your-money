import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { wrapFetch } from "../api/api-calls";
import { getItem, removeItem } from "../storage/local-storage-util";

export interface MoneyLocationData {
  user_id: string;
  money_location_id: string;
  location_name: string;
  amount: number;
  currency: string;
  last_checked: string;
  account_type: string;
  property_address?: string;
  purchase_date?: string;
  purchase_price?: number;
  attached_files?: string[];
  notes?: string;
}

interface UserData {
  _id: string;
  fullName: string;
  userName: string;
  email: string;
  createdAt: string;
  token: string;
}

export function useDashboard() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [moneyLocations, setMoneyLocations] = useState<MoneyLocationData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    loadUserData();
  }, []);

  function handleAuthFailure() {
    removeItem("userData");
    router.push("/");
  }

  function loadUserData() {
    const storedUserData = getItem("userData");
    if (!storedUserData) {
      handleAuthFailure();
      return;
    }

    try {
      const parsedUserData = JSON.parse(storedUserData);

      // Check if token exists and is valid (24 hour session)
      if (!parsedUserData.token) {
        handleAuthFailure();
        return;
      }

      // Decode JWT to check expiration (basic check)
      try {
        const tokenParts = parsedUserData.token.split(".");
        const payload = JSON.parse(atob(tokenParts[1]));
        const currentTime = Date.now() / 1000;

        if (payload.exp && payload.exp < currentTime) {
          // Token expired
          handleAuthFailure();
          return;
        }
      } catch (tokenError) {
        console.error("Invalid token format:", tokenError);
        handleAuthFailure();
        return;
      }

      setUserData(parsedUserData);
      fetchMoneyLocations(parsedUserData.userName);
    } catch (error) {
      console.error("Error parsing user data:", error);
      handleAuthFailure();
    }
  }

  async function fetchMoneyLocations(userName: string) {
    try {
      const userData = getItem("userData");
      if (!userData) {
        handleAuthFailure();
        return;
      }

      const parsedUserData = JSON.parse(userData);
      const token = parsedUserData.token;

      if (!token) {
        handleAuthFailure();
        return;
      }

      const response = await wrapFetch(
        `http://localhost:3020/money-locations/${userName}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.status === 401 || response.status === 403) {
        // Token expired or invalid
        handleAuthFailure();
        return;
      }

      if (data.success) {
        setMoneyLocations(data.data);
      } else {
        setError(data.message || "Failed to fetch money locations");
      }
    } catch (error) {
      console.error("Error fetching money locations:", error);
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  function handleLogout() {
    removeItem("userData");
    router.push("/");
  }

  async function handleAddMoneyLocation(newLocationData: any) {
    try {
      const userData = getItem("userData");
      if (!userData) {
        handleAuthFailure();
        return;
      }

      const parsedUserData = JSON.parse(userData);
      const token = parsedUserData.token;

      const response = await wrapFetch(
        "http://localhost:3020/money-locations",
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: JSON.stringify(newLocationData),
        }
      );

      const data = await response.json();

      if (response.status === 401 || response.status === 403) {
        handleAuthFailure();
        return;
      }

      if (data.success) {
        await fetchMoneyLocations(parsedUserData.userName);
        return true;
      } else {
        setError(data.message || "Failed to add money location");
        return false;
      }
    } catch (error) {
      console.error("Error adding money location:", error);
      setError("Network error. Please try again.");
      return false;
    }
  }

  async function handleDeleteMoneyLocation(moneyLocationId: string) {
    try {
      const userData = getItem("userData");
      if (!userData) {
        handleAuthFailure();
        return;
      }

      const parsedUserData = JSON.parse(userData);
      const token = parsedUserData.token;

      const response = await wrapFetch(
        `http://localhost:3020/money-locations/${moneyLocationId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await response.json();

      if (response.status === 401 || response.status === 403) {
        handleAuthFailure();
        return;
      }

      if (data.success) {
        await fetchMoneyLocations(parsedUserData.userName);
        return true;
      } else {
        setError(data.message || "Failed to delete money location");
        return false;
      }
    } catch (error) {
      console.error("Error deleting money location:", error);
      setError("Network error. Please try again.");
      return false;
    }
  }

  async function handleUpdateMoneyLocation(
    moneyLocationId: string,
    newAmount: number,
    onGoalSync?: () => void
  ) {
    try {
      const userData = getItem("userData");
      if (!userData) {
        handleAuthFailure();
        return;
      }

      const parsedUserData = JSON.parse(userData);
      const token = parsedUserData.token;

      const response = await wrapFetch(
        `http://localhost:3020/money-locations/${moneyLocationId}`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            amount: newAmount,
            last_checked: new Date().toISOString(),
          }),
        }
      );

      const data = await response.json();

      if (response.status === 401 || response.status === 403) {
        handleAuthFailure();
        return;
      }

      if (data.success) {
        await fetchMoneyLocations(parsedUserData.userName);

        if (onGoalSync) {
          console.log("Money location updated - triggering goal sync");
          await onGoalSync();
        }

        return true;
      } else {
        setError(data.message || "Failed to update money location");
        return false;
      }
    } catch (error) {
      console.error("Error updating money location:", error);
      setError("Network error. Please try again.");
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
