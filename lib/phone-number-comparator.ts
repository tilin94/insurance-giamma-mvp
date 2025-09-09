import { parsePhoneNumberFromString } from "libphonenumber-js"

export class PhoneNumberComparator {
  /**
   * Compares two phone numbers, normalizing and validating them
   * @param phoneNumber1 The first phone number
   * @param phoneNumber2 The second phone number
   * @param countryCode The country code for parsing (optional, used if phone numbers are not in international format)
   * @returns True if the phone numbers are the same, false otherwise
   */
  public compare(phoneNumber1: string, phoneNumber2: string, countryCode = "US"): boolean {
    // Parse both phone numbers
    const parsedPhone1 = parsePhoneNumberFromString(phoneNumber1, countryCode)
    const parsedPhone2 = parsePhoneNumberFromString(phoneNumber2, countryCode)

    if (!parsedPhone1 || !parsedPhone2) {
      return false // Invalid phone number format
    }

    // Normalize and compare the phone numbers
    return parsedPhone1.isValid() && parsedPhone2.isValid() && parsedPhone1.number === parsedPhone2.number
  }
}
