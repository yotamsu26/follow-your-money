interface ExchangeRates {
  [key: string]: number;
}

interface CurrencyAPIResponse {
  success?: boolean;
  result?: string;
  conversion_rates?: ExchangeRates;
  error?: string;
}

class CurrencyService {
  private static instance: CurrencyService;
  private exchangeRates: ExchangeRates = {};
  private lastUpdated: number = 0;
  private readonly CACHE_DURATION = 3600000; // 1 hour in milliseconds
  private readonly API_URL = "https://api.exchangerate-api.com/v4/latest/USD";

  // Static fallback rates as backup
  private readonly FALLBACK_RATES: ExchangeRates = {
    USD: 1,
    EUR: 0.85,
    GBP: 0.73,
    ILS: 3.4,
    JPY: 110,
    CAD: 1.25,
    AUD: 1.35,
    CHF: 0.92,
    CNY: 6.45,
    INR: 74.5,
  };

  private constructor() {}

  static getInstance(): CurrencyService {
    if (!CurrencyService.instance) {
      CurrencyService.instance = new CurrencyService();
    }
    return CurrencyService.instance;
  }

  async getExchangeRates(): Promise<ExchangeRates> {
    const now = Date.now();

    // Return cached rates if still valid
    if (
      now - this.lastUpdated < this.CACHE_DURATION &&
      Object.keys(this.exchangeRates).length > 0
    ) {
      return this.exchangeRates;
    }

    try {
      const response = await fetch(this.API_URL);
      const data: CurrencyAPIResponse = await response.json();

      if (data.conversion_rates) {
        this.exchangeRates = data.conversion_rates;
        this.lastUpdated = now;
        return this.exchangeRates;
      } else {
        throw new Error("Invalid API response format");
      }
    } catch (error) {
      this.exchangeRates = this.FALLBACK_RATES;
      this.lastUpdated = now;
      return this.exchangeRates;
    }
  }

  async convertCurrency(
    amount: number,
    fromCurrency: string,
    toCurrency: string
  ): Promise<number> {
    if (fromCurrency === toCurrency) {
      return amount;
    }

    const rates = await this.getExchangeRates();

    // Convert to USD first, then to target currency
    const usdAmount =
      fromCurrency === "USD" ? amount : amount / (rates[fromCurrency] || 1);
    const targetAmount =
      toCurrency === "USD" ? usdAmount : usdAmount * (rates[toCurrency] || 1);

    return targetAmount;
  }

  async getRate(fromCurrency: string, toCurrency: string): Promise<number> {
    if (fromCurrency === toCurrency) {
      return 1;
    }

    const rates = await this.getExchangeRates();

    // Convert to USD first, then to target currency
    const usdRate = fromCurrency === "USD" ? 1 : 1 / (rates[fromCurrency] || 1);
    const targetRate =
      toCurrency === "USD" ? usdRate : usdRate * (rates[toCurrency] || 1);

    return targetRate;
  }

  getSupportedCurrencies(): string[] {
    return Object.keys(this.FALLBACK_RATES);
  }

  isUsingLiveRates(): boolean {
    return this.lastUpdated > 0 && Object.keys(this.exchangeRates).length > 10;
  }
}

export const currencyService = CurrencyService.getInstance();
export default currencyService;
