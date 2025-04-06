/**
 * Returns a list of all supported IANA time zone identifiers.
 * If Intl.supportedValuesOf is unavailable, falls back to a small set of timezones.
 */
export function getTimeZones(): string[] {
    if (typeof Intl !== 'undefined' && typeof Intl.supportedValuesOf === 'function') {
        try {
            // Returns an array of time zone names, like ["America/New_York", "Europe/London", ...]
            return Intl.supportedValuesOf("timeZone");
        } catch (error) {
            console.error("Error retrieving time zones via Intl.supportedValuesOf:", error);
        }
    }

    // Fallback list if the above method isn't available. 
    // You can extend this list as needed, or consider using a library like 'moment-timezone' for full coverage.
    return [
        "UTC",
        "America/New_York",
        "America/Los_Angeles",
        "Europe/London",
        "Europe/Paris",
        "Asia/Tokyo",
        "Australia/Sydney",
        "Africa/Nairobi"
    ];
}



/**
 * Validates whether a given URL string is in a proper format.
 *
 * @param url - The URL string to validate. Can be undefined.
 * @returns A boolean indicating whether the URL is valid (`true`) or not (`false`).
 *
 * The function checks if the URL matches a specific pattern that includes:
 * - An optional protocol (`http` or `https`).
 * - A valid domain name with at least one dot and a valid top-level domain (TLD).
 * - An optional port number.
 * - An optional path.
 *
 * Example usage:
 * ```typescript
 * checkValidUrl("https://example.com"); // true
 * checkValidUrl("invalid-url"); // false
 * ```
 */
export function checkValidUrl(url: string | undefined): boolean {
    if (!url) return false;
    const pattern = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(:\d+)?(\/[^\s]*)?$/;
    return pattern.test(url);
}