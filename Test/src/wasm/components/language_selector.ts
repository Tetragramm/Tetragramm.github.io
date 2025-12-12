/**
 * Language Selector Component
 *
 * Displays a dropdown for selecting the UI language
 * Updates the entire UI when language changes
 */

import { localization } from '../localization';

export class LanguageSelector {
    private container: HTMLElement;
    private select: HTMLSelectElement | null = null;

    constructor(containerId: string) {
        const container = document.getElementById(containerId);
        if (!container) {
            throw new Error(`Container element '${containerId}' not found`);
        }
        this.container = container;
        this.render();
    }

    /**
     * Render the language selector
     */
    render(): void {
        // Clear existing content
        this.container.innerHTML = '';

        // Create label
        const label = document.createElement('label');
        label.htmlFor = 'language_selector';
        label.textContent = 'Language: ';
        label.style.marginRight = '0.5em';

        // Create select element
        this.select = document.createElement('select');
        this.select.id = 'language_selector';
        this.select.className = 'mobile-select';
        this.select.style = "min-width:0px; width:auto;";

        // Language names for display
        const languageNames: Record<string, string> = {
            'en': 'English',
            'de': 'Deutsch',
            'es': 'Español',
            'fr': 'Français',
        };

        // Get available languages and current locale
        const languages = localization.getAvailableLanguages();
        const currentLocale = localization.getCurrentLocale();

        // Add options
        languages.forEach(lang => {
            const option = document.createElement('option');
            option.value = lang;
            option.textContent = languageNames[lang] || lang;
            if (lang === currentLocale) {
                option.selected = true;
            }
            this.select!.appendChild(option);
        });

        // Add change event listener
        this.select.addEventListener('change', (e) => {
            const newLocale = (e.target as HTMLSelectElement).value;
            console.log(`[LanguageSelector] Changing locale to: ${newLocale}`);
            localization.setLocale(newLocale);
        });

        // Append to container
        this.container.appendChild(label);
        this.container.appendChild(this.select);

        console.log('[LanguageSelector] Rendered');
    }

    /**
     * Update the selector (e.g., if available languages change)
     */
    update(): void {
        this.render();
    }

    /**
     * Get the currently selected language
     */
    getSelectedLanguage(): string {
        return this.select?.value || 'en';
    }
}
