/**
 * Era UI Component
 *
 * Displays the Era selection using UIBindings from Rust
 * Demonstrates the full WASM + localization flow
 */

import { AircraftBridge } from '../aircraft_bridge';
import { BindingRenderer } from '../binding_renderer';
import { localization } from '../localization';

export class EraUI {
    private container: HTMLElement;
    private renderer: BindingRenderer;
    private sectionElement: HTMLElement | null = null;

    // Cache DOM elements to avoid recreating
    private selectElement: HTMLSelectElement | null = null;

    constructor(
        private getBridge: () => AircraftBridge | null,
        containerId: string,
        private onUpdate?: () => void
    ) {
        const container = document.getElementById(containerId);
        if (!container) {
            throw new Error(`Container element '${containerId}' not found`);
        }
        this.container = container;

        // Get the initial bridge for renderer
        const bridge = this.getBridge();
        if (!bridge) {
            throw new Error('Bridge not available during EraUI construction');
        }

        // Create renderer with stats update callback
        this.renderer = new BindingRenderer(bridge, () => {
            if (this.onUpdate) {
                this.onUpdate();
            }
        });

        // Listen for locale changes and do full rebuild (text changes)
        localization.onLocaleChange(() => this.rebuildFull());

        this.render();
    }

    /**
     * Render the Era selection UI - intelligently updates or rebuilds
     */
    render(): void {
        const bridge = this.getBridge();
        if (!bridge || !bridge.isInitialized()) {
            console.warn('[EraUI] Bridge not initialized, skipping render');
            return;
        }

        // If we have cached elements, just update values. Otherwise rebuild.
        if (this.selectElement) {
            this.updateValues();
        } else {
            this.rebuildFull();
        }
    }

    /**
     * Full rebuild of the UI structure (used on first render or locale change)
     */
    private rebuildFull(): void {
        // Clear cache
        this.selectElement = null;

        // Clear existing content
        this.container.innerHTML = '';

        const bridge = this.getBridge();
        if (!bridge || !bridge.isInitialized()) {
            console.warn('[EraUI] Bridge not initialized, skipping rebuild');
            return;
        }

        const eraBindings = bridge.getEraBindings();

        // Create table for Era selection
        const table = document.createElement('table');
        table.style.width = '100%';
        table.id = 'table_era';

        const row = document.createElement('tr');
        const cell = document.createElement('td');

        // Render the Era select dropdown and cache it
        this.selectElement = this.renderer.renderSelect(
            eraBindings.selected_era,
            (selectedIndex) => {
                // Update the binding
                const bindings = bridge.getEraBindings();
                bindings.selected_era.selected = selectedIndex;

                // Send back to Rust
                bridge.setEraBindings(bindings);

                // Re-render to update any dependent states
                this.render();

                console.log(`[EraUI] Era changed to index ${selectedIndex}`);
            }
        ) as HTMLSelectElement;

        cell.appendChild(this.selectElement);
        row.appendChild(cell);
        table.appendChild(row);

        // Create collapsible section with localized title
        const sectionTitle = localization.translate('Era Section Title');
        this.sectionElement = this.renderer.createCollapsibleSection(
            sectionTitle,
            table,
            true // Initially open
        );

        // Add rules link (h4)
        const rulesLine = document.createElement('h4');
        const rulesLink = document.createElement('a');
        rulesLink.href = './Rules/Rules.htm#_Era';
        const rulesText = document.createElement('u');
        rulesText.textContent = 'Rules';
        rulesLink.appendChild(rulesText);
        rulesLine.appendChild(document.createTextNode('('));
        rulesLine.appendChild(rulesLink);
        rulesLine.appendChild(document.createTextNode(')'));

        // Insert rules link before content
        this.sectionElement.insertBefore(
            rulesLine,
            this.sectionElement.children[1]
        );

        this.container.appendChild(this.sectionElement);

        console.log('[EraUI] Full rebuild complete');
    }

    /**
     * Update values in existing DOM elements (fast path)
     */
    private updateValues(): void {
        const bridge = this.getBridge();
        if (!bridge || !bridge.isInitialized() || !this.selectElement) {
            return;
        }

        const eraBindings = bridge.getEraBindings();

        // Update select element
        this.selectElement.selectedIndex = eraBindings.selected_era.selected;
        this.selectElement.disabled = !eraBindings.selected_era.enabled;

        // Update options' enabled state
        eraBindings.selected_era.options.forEach((opt, idx) => {
            if (idx < this.selectElement!.options.length) {
                this.selectElement!.options[idx].disabled = !opt.enabled;
            }
        });
    }

    /**
     * Update the UI (e.g., when data changes externally)
     */
    update(): void {
        this.render();
    }

    /**
     * Destroy the component and clean up listeners
     */
    destroy(): void {
        this.container.innerHTML = '';
        // Note: LocalizationManager handles listener cleanup
    }
}
