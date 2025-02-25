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
