import { describe, expect, it } from "@jest/globals";
import validatePhoneNumber from "../validatePhoneNumber";

describe("validatePhoneNumber", () => {
  it("should validate a valid Indian phone number", () => {
    const phoneNumber = "+917394926646";
    const countryCode = "IN";
    const isValid = validatePhoneNumber(phoneNumber, countryCode);
    expect(isValid).toBe(true);
  });

  it("should validate a valid Malaysian phone number", () => {
    const phoneNumber = "+60123456789";
    const countryCode = "MY";
    const isValid = validatePhoneNumber(phoneNumber, countryCode);
    expect(isValid).toBe(true);
  });

  it("should reject an invalid Indian phone number", () => {
    const phoneNumber = "1234"; // Invalid Indian number
    const countryCode = "IN";
    const isValid = validatePhoneNumber(phoneNumber, countryCode);
    expect(isValid).toBe(false);
  });

  it("should reject an invalid Malaysian phone number", () => {
    const phoneNumber = "60123"; // Invalid Malaysian number
    const countryCode = "MY";
    const isValid = validatePhoneNumber(phoneNumber, countryCode);
    expect(isValid).toBe(false);
  });

  it("should handle a missing country code", () => {
    const phoneNumber = "1234567890";
    const countryCode = "US"; // Assuming US is not in phoneRegexMapper
    const isValid = validatePhoneNumber(phoneNumber, countryCode);
    expect(isValid).toBe(false);
  });

  it("should handle a missing phoneNumber", () => {
    const phoneNumber = "";
    const countryCode = "US"; // Assuming US is not in phoneRegexMapper
    expect(() => validatePhoneNumber(phoneNumber, countryCode)).toThrow(
      "Parameter `phoneNumber` is invalid!"
    );
  });
});
