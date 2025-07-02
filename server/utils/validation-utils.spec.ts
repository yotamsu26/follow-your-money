import {
  AccountType,
  Currency,
  MoneyLocationData,
} from "../db/collection-utils";
import { validData } from "./validation-utils";

describe("validData", () => {
  it("should return false if account type is real estate and property address is missing", () => {
    const data: MoneyLocationData = {
      user_id: "123",
      money_location_id: "456",
      location_name: "Test Account",
      amount: 100,
      currency: Currency.USD,
      account_type: AccountType.REAL_ESTATE,
      last_checked: new Date(),
    };
    expect(validData(data)).toBe(false);
  });

  it("should return true if data is valid", () => {
    const data: MoneyLocationData = {
      user_id: "123",
      money_location_id: "456",
      location_name: "Test Account",
      amount: 100,
      currency: Currency.USD,
      account_type: AccountType.CASH,
      last_checked: new Date(),
    };
    expect(validData(data)).toBe(true);
  });
});
