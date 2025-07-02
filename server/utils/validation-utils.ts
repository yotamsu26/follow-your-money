import { AccountType, MoneyLocationData } from "../db/collection-utils";

export function validData(data: MoneyLocationData) {
  if (
    !data.user_id ||
    !data.money_location_id ||
    !data.location_name ||
    !data.amount ||
    !data.currency ||
    !data.account_type
  ) {
    return false;
  }
  if (data.account_type === AccountType.REAL_ESTATE && !data.property_address) {
    return false;
  }
  return true;
}
