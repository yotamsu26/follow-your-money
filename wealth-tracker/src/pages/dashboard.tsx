import { useState } from "react";
import { Card } from "../components/basic-components/Card";
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

  const { syncGoalsWithMoneyLocations } = useGoals();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  async function handleAddLocation(newLocationData: any) {
    const success = await handleAddMoneyLocation(newLocationData);
    if (success) {
      setIsAddModalOpen(false);
    }
  }

  async function handleUpdateLocation(
    moneyLocationId: string,
    newAmount: number
  ) {
    const success = await handleUpdateMoneyLocation(
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
        await syncGoalsWithMoneyLocations(updatedMoneyLocations);
      }
    );
    return success;
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
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
            <button
              onClick={() => setError("")}
              className="float-right font-bold text-red-700 hover:text-red-900"
            >
              ×
            </button>
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
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <span>📍</span>
              <span>Add Location</span>
            </button>
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
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
              >
                Add Your First Location
              </button>
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
            onAdd={handleAddLocation}
            userName={userData?.userName || ""}
          />
        </MoneyLocationModalWrapper>
      </main>
    </div>
  );
}
