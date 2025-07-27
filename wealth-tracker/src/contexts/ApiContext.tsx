import React, { createContext, useContext, ReactNode } from "react";
import { useRouter } from "next/router";
import { createApiClient } from "../api/api-calls";
import { removeItem } from "../storage/local-storage-util";

interface ApiContextType {
  apiClient: ReturnType<typeof createApiClient>;
}

const ApiContext = createContext<ApiContextType | undefined>(undefined);

interface ApiProviderProps {
  children: ReactNode;
}

function ApiProvider({ children }: ApiProviderProps) {
  const router = useRouter();

  function handleAuthFailure() {
    removeItem("userData");
    router.push("/");
  }

  const apiClient = createApiClient({ onAuthFailure: handleAuthFailure });

  return (
    <ApiContext.Provider value={{ apiClient }}>{children}</ApiContext.Provider>
  );
}

export function useApiClient() {
  const context = useContext(ApiContext);
  if (context === undefined) {
    throw new Error("useApiClient must be used within an ApiProvider");
  }
  return context.apiClient;
}

export default ApiProvider;
