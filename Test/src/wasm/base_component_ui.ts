/**
 * Base Component UI Class
 *
 * Abstract base class that handles common lifecycle patterns for all WASM components
 * Reduces boilerplate by 60-70% across component implementations
 */

import { AircraftBridge } from './aircraft_bridge';
import { BindingRenderer } from './binding_renderer';
import { localization } from './localization';

export abstract class BaseComponentUI {
    protected container: HTMLElement;
    protected renderer: BindingRenderer;
    protected sectionElement: HTMLElement | null = null;

    constructor(
        protected getBridge: () => AircraftBridge | null,
        containerId: string,
        protected onUpdate?: () => void
    ) {
        // Get container
        const container = document.getElementById(containerId);
        if (!container) {
            throw new Error(`Container element '${containerId}' not found`);
        }
        this.container = container;

        // Get bridge
        const bridge = this.getBridge();
        if (!bridge) {
            throw new Error(`Bridge not available during ${this.constructor.name} construction`);
        }

        // Create renderer with stats update callback
        this.renderer = new BindingRenderer(bridge, () => {
            if (this.onUpdate) {
                this.onUpdate();
            }
        });

        // Listen for locale changes and do full rebuild
        localization.onLocaleChange(() => this.rebuildFull());

        // Initial render
        this.render();
    }

    /**
     * Render the UI - intelligently updates or rebuilds
     * Checks if we have cached elements; if so, just update values
     * Otherwise, do a full rebuild
     */
    render(): void {
        console.log(`[${this.constructor.name}] render() called`);

        const bridge = this.getBridge();
        if (!bridge) {
            console.warn(`[${this.constructor.name}] Bridge is null, skipping render`);
            return;
        }

        if (!bridge.isInitialized()) {
            console.warn(`[${this.constructor.name}] Bridge not initialized, skipping render`);
            return;
        }

        const shouldUpdate = this.shouldUpdate();
        console.log(`[${this.constructor.name}] shouldUpdate() returned:`, shouldUpdate);

        if (shouldUpdate) {
            console.log(`[${this.constructor.name}] Calling updateValues()`);
            this.updateValues();
        } else {
            console.log(`[${this.constructor.name}] Calling rebuildFull()`);
            this.rebuildFull();
        }
    }

    /**
     * Update the UI (e.g., when data changes externally)
     * Public method that can be called from outside
     */
    update(): void {
        this.render();
    }

    /**
     * Destroy the component and clean up listeners
     * Clears DOM and resets cache
     */
    destroy(): void {
        this.container.innerHTML = '';
        this.clearCache();
    }

    /**
     * Determine if we should update values or rebuild
     * Override in subclass to check if cached elements exist
     * @returns true if cached elements exist and we can do a fast update
     */
    protected abstract shouldUpdate(): boolean;

    /**
     * Full rebuild of the UI structure (used on first render or locale change)
     * Subclass must implement the actual rendering logic
     */
    protected abstract rebuildFull(): void;

    /**
     * Update values in existing DOM elements (fast path)
     * Subclass must implement the value update logic
     */
    protected abstract updateValues(): void;

    /**
     * Clear cached DOM references
     * Subclass must implement to clear its specific cached elements
     */
    protected abstract clearCache(): void;

    /**
     * Helper method to validate bridge is available
     * @returns The bridge if available, null otherwise
     */
    protected getBridgeIfInitialized(): AircraftBridge | null {
        const bridge = this.getBridge();
        if (!bridge || !bridge.isInitialized()) {
            console.warn(`[${this.constructor.name}] Bridge not initialized`);
            return null;
        }
        return bridge;
    }
}
