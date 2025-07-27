import { useState } from "react";
import { Card } from "../components/basic-components/Card";
import { Button } from "../components/basic-components/Button";
import { AddMoneyLocationModal } from "../components/dashboard-components/AddMoneyLocationModal";
import { WealthSummary } from "../components/dashboard-components/WealthSummary";
import { GoalsTracker } from "../components/dashboard-components/GoalsTracker";
import { MoneyLocationModalWrapper } from "../components/modal/MoneyLocationModalWrapper";
import { useDashboard } from "../hooks/useDashboard";
import { useGoals } from "../hooks/useGoals";

export default function Dashboard() {
  const {
    userData,
    moneyLocations,
    isLoading,
    error,
    handleLogout,
    handleAddMoneyLocation,
    handleDeleteMoneyLocation,
    handleUpdateMoneyLocation,
    setError,
  } = useDashboard();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  async function handleUpdateLocation(
    moneyLocationId: string,
    newAmount: number
  ) {
    const response = await handleUpdateMoneyLocation(
      moneyLocationId,
      newAmount,
      async () => {
        // Create updated money locations array with the new amount
        const updatedMoneyLocations = moneyLocations.map((location) =>
          location.money_location_id === moneyLocationId
            ? {
                ...location,
                amount: newAmount,
                last_checked: new Date().toISOString(),
              }
            : location
        );
      }
    );
    return response;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading your wealth data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-blue-800">
                Wealth Tracker
              </h1>
              <p className="text-gray-600">
                Welcome back, {userData?.fullName}
              </p>
            </div>
            <Button
              onClick={handleLogout}
              variant="secondary"
              className="bg-red-500 hover:bg-red-600 focus:ring-red-500"
            >
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
            <Button
              onClick={() => setError("")}
              variant="outline"
              size="sm"
              className="float-right font-bold text-red-700 hover:text-red-900 border-none hover:bg-transparent focus:ring-red-400"
            >
              ×
            </Button>
          </div>
        )}

        {/* Wealth Summary Dashboard */}
        <WealthSummary moneyLocations={moneyLocations} />

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Goals Tracker */}
          <div className="lg:col-span-2">
            <GoalsTracker
              userName={userData?.userName || ""}
              moneyLocations={moneyLocations}
            />
          </div>
        </div>

        {/* Money Locations Section */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Your Money Locations
            </h2>
            <Button
              onClick={() => setIsAddModalOpen(true)}
              variant="secondary"
              className="flex items-center space-x-2"
            >
              <span>📍</span>
              <span>Add Location</span>
            </Button>
          </div>
          {moneyLocations.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
              <div className="text-6xl mb-4">💰</div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">
                No money locations yet
              </h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                Start tracking your wealth by adding your first money location.
                This could be a bank account, investment, or any asset.
              </p>
              <Button
                onClick={() => setIsAddModalOpen(true)}
                variant="secondary"
                size="lg"
              >
                Add Your First Location
              </Button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {moneyLocations.map((location) => (
                <Card
                  key={location.money_location_id}
                  moneyLocationData={location}
                  onDelete={handleDeleteMoneyLocation}
                  onUpdateAmount={handleUpdateLocation}
                />
              ))}
            </div>
          )}
        </div>

        <MoneyLocationModalWrapper
          isOpen={isAddModalOpen}
          title="Add Money Location"
        >
          <AddMoneyLocationModal
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
            onAdd={handleAddMoneyLocation}
            userName={userData?.userName || ""}
          />
        </MoneyLocationModalWrapper>
      </main>
    </div>
  );
}
