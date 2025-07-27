import { Currency } from "../utils/currency-utils";

export const CURRENCIES = [
  { value: Currency.USD, label: "USD" },
  { value: Currency.EUR, label: "EUR" },
  { value: Currency.GBP, label: "GBP" },
  { value: Currency.ILS, label: "ILS" },
];

export const CURRENCY_LABELS = {
  [Currency.USD]: "USD - US Dollar",
  [Currency.EUR]: "EUR - Euro",
  [Currency.GBP]: "GBP - British Pound",
  [Currency.ILS]: "ILS - Israeli Shekel",
};
