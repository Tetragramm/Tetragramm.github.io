/**
 * Localization Manager for Flying Circus Plane Builder
 *
 * Manages language selection and translation, backed by Rust i18n system
 */

// These will be imported from the WASM package once built
// For now, we'll create type definitions
export interface LocalizationAPI {
    getAvailableLanguages(): string[];
    getLocale(): string;
    setLocale(locale: string): void;
    translate(key: string): string;
    translateWithParam(key: string, value: string): string;
}

// Singleton pattern for localization management
export class LocalizationManager {
    private static instance: LocalizationManager;
    private currentLocale: string = 'en';
    private listeners: Array<(locale: string) => void> = [];
    private wasmLocalization: LocalizationAPI | null = null;

    private constructor() {
        // Initialize from localStorage or browser preference
        const savedLocale = localStorage.getItem('language');
        const browserLocale = navigator.language.split('-')[0];
        this.currentLocale = savedLocale || browserLocale || 'en';
    }

    static getInstance(): LocalizationManager {
        if (!LocalizationManager.instance) {
            LocalizationManager.instance = new LocalizationManager();
        }
        return LocalizationManager.instance;
    }

    /**
     * Initialize with WASM localization API
     * Call this after WASM module is loaded
     */
    initializeWasm(wasmLocalization: LocalizationAPI): void {
        this.wasmLocalization = wasmLocalization;
        // Set the initial locale in Rust
        this.wasmLocalization.setLocale(this.currentLocale);
    }

    /**
     * Get available languages from WASM
     */
    getAvailableLanguages(): string[] {
        if (this.wasmLocalization) {
            return this.wasmLocalization.getAvailableLanguages();
        }
        // Fallback if WASM not loaded yet
        return ['en', 'de'];
    }

    /**
     * Get current locale
     */
    getCurrentLocale(): string {
        if (this.wasmLocalization) {
            return this.wasmLocalization.getLocale();
        }
        return this.currentLocale;
    }

    /**
     * Set locale and notify all listeners
     */
    setLocale(locale: string): void {
        if (this.wasmLocalization) {
            this.wasmLocalization.setLocale(locale);
        }
        this.currentLocale = locale;
        localStorage.setItem('language', locale);

        // Notify all listeners to re-render
        this.listeners.forEach(callback => callback(locale));
    }

    /**
     * Translate a key using Rust i18n
     */
    translate(key: string): string {
        if (this.wasmLocalization) {
            return this.wasmLocalization.translate(key);
        }
        // Fallback: return the key itself if WASM not loaded
        return key;
    }

    /**
     * Translate a key with parameter interpolation
     * The translation string should contain %{A} which will be replaced with the value
     */
    translateWithParam(key: string, value: string | number): string {
        const strValue = String(value);
        if (this.wasmLocalization) {
            return this.wasmLocalization.translateWithParam(key, strValue);
        }
        // Fallback: return key with value appended if WASM not loaded
        return `${key} ${strValue}`;
    }

    /**
     * Shorthand function for translation
     */
    t(key: string): string {
        return this.translate(key);
    }

    /**
     * Register callback for locale changes
     */
    onLocaleChange(callback: (locale: string) => void): void {
        this.listeners.push(callback);
    }

    /**
     * Unregister callback
     */
    offLocaleChange(callback: (locale: string) => void): void {
        this.listeners = this.listeners.filter(cb => cb !== callback);
    }

    /**
     * Clear all locale change listeners
     */
    clearListeners(): void {
        this.listeners = [];
    }
}

// Export singleton instance and convenience function
export const localization = LocalizationManager.getInstance();
export const t = (key: string) => localization.t(key);
