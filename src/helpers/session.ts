/**
 * Retrieves a value from local storage based on a key.
 *
 * @param key - The key to look up in local storage.
 * @returns The stored value as a string, or null if the key does not exist or if window is undefined.
 */
export function getFromLocalStorage(key: string): string | null {
    if (typeof window !== 'undefined') {
        return window.localStorage.getItem(key);
    }
    return null;
}

/**
 * Retrieves a value from session storage based on a key.
 *
 * @param key - The key to look up in session storage.
 * @returns The stored value as a string, or null if the key does not exist or if window is undefined.
 */
export function getFromSessionStorage(key: string): string | null {
    if (typeof window !== 'undefined') {
        return window.sessionStorage.getItem(key);
    }
    return null;
}

/**
 * Retrieves data based on the user's "remember me" preference.
 *
 * @param key - The key to look up.
 * @param remember - If true, data is retrieved from local storage. Otherwise, its retrieved from session storage.
 * @returns The stored value, or null if not found.
 */
export function getFromLocalOrSession(key: string, remember: boolean): string | null {
    if (typeof window !== 'undefined') {
        if (remember) {
            return window.localStorage.getItem(key);
        } else {
            return window.sessionStorage.getItem(key);
        }
    }
    return null;
}

/**
 * Writes or updates a value in local storage.
 *
 * @param key - The key to use for storing the value.
 * @param value - The value to store.
 */
export function writeToLocalStorage(key: string, value: string): void {
    if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, value);
    }
}

/**
 * Writes or updates a value in session storage.
 *
 * @param key - The key to use for storing the value.
 * @param value - The value to store.
 */
export function writeToSessionStorage(key: string, value: string): void {
    if (typeof window !== 'undefined') {
        window.sessionStorage.setItem(key, value);
    }
}

/**
 * Stores data based on the user's "remember me" preference.
 *
 * @param key - The key to store the value under.
 * @param value - The value to store.
 * @param remember - If true, data is stored persistently in local storage. Otherwise, session storage is used.
 */
export function writeToLocalOrSession(key: string, value: string, remember: boolean): void {
    if (typeof window !== 'undefined') {
        if (remember) {
            window.localStorage.setItem(key, value);
        } else {
            window.sessionStorage.setItem(key, value);
        }
    }
}

/**
 * Deletes an item from local storage.
 *
 * @param key - The key corresponding to the item to remove.
 */
export function deleteFromLocalStorage(key: string): void {
    if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
    }
}

/**
 * Deletes an item from session storage.
 *
 * @param key - The key corresponding to the item to remove.
 */
export function deleteFromSessionStorage(key: string): void {
    if (typeof window !== 'undefined') {
        window.sessionStorage.removeItem(key);
    }
}

/**
 * deletes data based on the user's "remember me" preference.
 *
 * @param key - The key to store the value under.
 * @param value - The value to store.
 * @param remember - If true, data is deleted from local storage. Otherwise, its deleted from session storage.
 */
export function deleteFromLocalOrSession(key: string, remember: boolean): void {
    if (typeof window !== 'undefined') {
        if (remember) {
            window.localStorage.removeItem(key);
        } else {
            window.sessionStorage.removeItem(key);;
        }
    }
}


/**
 * Deletes an item from bon both storages.
 * This function first looks into session storage then falls back to local storage.
 * (You could customize this if you have a way to know where the data was stored.)
 *
 * @param key - The key corresponding to the item to remove.
 */
export function deleteFromLocalAndSession(key: string): void {
    if (typeof window !== 'undefined') {
        // delete from both session and local storege.
        window.sessionStorage.removeItem(key);
        window.localStorage.removeItem(key);
    }
}
