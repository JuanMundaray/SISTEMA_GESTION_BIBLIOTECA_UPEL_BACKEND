/**
 * Normalizes and validates a Venezuelan phone number.
 * - Removes spaces, hyphens, and parentheses.
 * - Ensures it starts with +58 country code.
 * - Removes the leading 0 after +58 if present.
 * @param {string} phoneNumber - Phone number in any format.
 * @returns {string} - Normalized number (+58XXXXXXXXXX).
 * @throws {Error} - When the number is invalid.
 */
function normalizeVenezuelanPhoneNumber(phoneNumber) {
    if (!phoneNumber) {
        throw new Error('Phone number cannot be empty');
    }

    // Remove all non-digit characters except '+'
    const cleanedNumber = phoneNumber.replace(/[^\d+]/g, '');

    // Case 1: Already in +58 format followed by 10 digits (may have extra 0)
    if (/^\+58(0?\d{10})$/.test(cleanedNumber)) {
        const digits = cleanedNumber.substring(3); // Remove "+58"
        // If first digit is 0 (e.g. "0412..."), remove it
        return `+58${digits.startsWith('0') ? digits.substring(1) : digits}`;
    }

    // Case 2: Doesn't have +58 but starts with 0 or area code (e.g. 0424, 0212)
    if (/^(0?[24]\d{9})$/.test(cleanedNumber)) {
        return `+58${cleanedNumber.replace(/^0/, '')}`; // Remove leading 0 if exists
    }

    // If no valid format matches
    throw new Error('Invalid Venezuelan phone number format. Must start with +58, 0, 2, or 4 and have 10 digits after country code');
}

module.exports = {
    normalizeVenezuelanPhoneNumber
};