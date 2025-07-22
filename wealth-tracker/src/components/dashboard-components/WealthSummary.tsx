import { useState, useEffect } from "react";
import { MoneyLocationData } from "../../types/money-location-types";
import { Currency } from "../../utils/currency-utils";
import {
  calculateAssetAllocation,
  calculateAvailableWealth,
  calculateNonAvailableWealth,
} from "../../utils/calculation-utils";
import currencyService from "../../services/currencyService";
import { AvailableWealthCard } from "./AvailableWealthCard";
import { NonAvailableWealthCard } from "./NonAvailableWealthCard";
import { AssetAllocationCard } from "./AssetAllocationCard";
import { ActiveAccountsCard } from "./ActiveAccountsCard";
import { GrowthRateCard } from "./GrowthRateCard";

interface WealthSummaryProps {
  moneyLocations: MoneyLocationData[];
}

export function WealthSummary({ moneyLocations }: WealthSummaryProps) {
  const [availableWealth, setAvailableWealth] = useState<number>(0);
  const [nonAvailableWealth, setNonAvailableWealth] = useState<number>(0);
  const [assetAllocation, setAssetAllocation] = useState<
    Array<{
      type: string;
      amount: number;
      percentage: number;
    }>
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState<string>(
    Currency.USD
  );
  const [convertedAvailableWealth, setConvertedAvailableWealth] =
    useState<number>(0);
  const [convertedNonAvailableWealth, setConvertedNonAvailableWealth] =
    useState<number>(0);
  const [supportedCurrencies, setSupportedCurrencies] = useState<string[]>([]);

  useEffect(() => {
    // Load supported currencies
    const loadCurrencies = async () => {
      try {
        await currencyService.getExchangeRates(); // Initialize rates
        const currencies = currencyService.getSupportedCurrencies();
        setSupportedCurrencies(currencies);
      } catch (error) {
        console.error("Error loading currencies:", error);
        setSupportedCurrencies([
          Currency.USD,
          Currency.EUR,
          Currency.GBP,
          Currency.ILS,
        ]);
      }
    };
    loadCurrencies();
  }, []);

  useEffect(() => {
    async function calculateValues() {
      setIsLoading(true);
      try {
        const [availWealth, nonAvailWealth, allocation] = await Promise.all([
          calculateAvailableWealth(moneyLocations),
          calculateNonAvailableWealth(moneyLocations),
          calculateAssetAllocation(moneyLocations),
        ]);
        setAvailableWealth(availWealth);
        setNonAvailableWealth(nonAvailWealth);
        setAssetAllocation(allocation);
      } catch (error) {
        console.error("Error calculating wealth summary:", error);
      }

      setIsLoading(false);
    }
    if (moneyLocations.length > 0) {
      calculateValues();
    } else {
      setAvailableWealth(0);
      setNonAvailableWealth(0);
      setAssetAllocation([]);
    }
  }, [moneyLocations]);

  useEffect(() => {
    // Convert wealth to selected currency
    const convertWealth = async () => {
      if (selectedCurrency !== Currency.USD) {
        try {
          const [convertedAvail, convertedNonAvail] = await Promise.all([
            availableWealth > 0
              ? currencyService.convertCurrency(
                  availableWealth,
                  Currency.USD,
                  selectedCurrency as Currency
                )
              : 0,
            nonAvailableWealth > 0
              ? currencyService.convertCurrency(
                  nonAvailableWealth,
                  Currency.USD,
                  selectedCurrency as Currency
                )
              : 0,
          ]);
          setConvertedAvailableWealth(convertedAvail);
          setConvertedNonAvailableWealth(convertedNonAvail);
        } catch (error) {
          setConvertedAvailableWealth(availableWealth);
          setConvertedNonAvailableWealth(nonAvailableWealth);
        }
      } else {
        setConvertedAvailableWealth(availableWealth);
        setConvertedNonAvailableWealth(nonAvailableWealth);
      }
    };

    convertWealth();
  }, [availableWealth, nonAvailableWealth, selectedCurrency]);

  const recentActivity = moneyLocations.length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
      <AvailableWealthCard
        availableWealth={availableWealth}
        convertedAvailableWealth={convertedAvailableWealth}
        isLoading={isLoading}
        selectedCurrency={selectedCurrency}
        setSelectedCurrency={setSelectedCurrency}
        supportedCurrencies={supportedCurrencies}
      />

      <NonAvailableWealthCard
        nonAvailableWealth={nonAvailableWealth}
        convertedNonAvailableWealth={convertedNonAvailableWealth}
        isLoading={isLoading}
        selectedCurrency={selectedCurrency}
        setSelectedCurrency={setSelectedCurrency}
        supportedCurrencies={supportedCurrencies}
      />

      <AssetAllocationCard
        assetAllocation={assetAllocation}
        isLoading={isLoading}
      />

      <ActiveAccountsCard recentActivity={recentActivity} />

      <GrowthRateCard moneyLocations={moneyLocations} />
    </div>
  );
}
