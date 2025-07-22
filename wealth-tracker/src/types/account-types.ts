export enum AccountType {
  CASH = "cash",
  BANK_ACCOUNT = "bank_account",
  PENSION_ACCOUNT = "pension_account",
  REAL_ESTATE = "real_estate",
  INVESTMENT = "investment",
  EDUCATION_FUND = "education_fund",
}

export const ACCOUNT_TYPES = [
  { value: "cash", label: "Cash" },
  { value: "bank_account", label: "Bank Account" },
  { value: "pension_account", label: "Pension Account" },
  { value: "real_estate", label: "Real Estate" },
  { value: "investment", label: "Investment" },
  { value: "education_fund", label: "Education Fund" },
];

export const AVAILABLE_ACCOUNT_TYPES = [
  "cash",
  "bank_account",
  "real_estate",
  "investment",
];

export const NON_AVAILABLE_ACCOUNT_TYPES = [
  "pension_account",
  "education_fund",
];
