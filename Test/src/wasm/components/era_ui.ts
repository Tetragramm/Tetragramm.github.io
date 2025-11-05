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

        // Listen for locale changes and re-render
        localization.onLocaleChange(() => this.render());

        this.render();
    }

    /**
     * Render the Era selection UI
     */
    render(): void {
        // Clear existing content
        this.container.innerHTML = '';

        // Get current bridge (may be new after language change)
        const bridge = this.getBridge();
        if (!bridge || !bridge.isInitialized()) {
            console.warn('[EraUI] Bridge not initialized, skipping render');
            return;
        }

        // Get Era bindings from Rust (includes localized strings)
        const eraBindings = bridge.getEraBindings();

        // Create table for Era selection
        const table = document.createElement('table');
        table.style.width = '100%';
        table.id = 'table_era';

        const row = document.createElement('tr');
        const cell = document.createElement('td');

        // Render the Era select dropdown
        // The binding.options already have localized names from Rust
        const selectElement = this.renderer.renderSelect(
            eraBindings.selected_era,
            (selectedIndex) => {
                // Update the binding
                eraBindings.selected_era.selected = selectedIndex;

                // Send back to Rust
                bridge.setEraBindings(eraBindings);

                // Re-render to update any dependent states
                this.render();

                console.log(`[EraUI] Era changed to index ${selectedIndex}`);
            }
        );

        cell.appendChild(selectElement);
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

        console.log('[EraUI] Rendered with locale:', localization.getCurrentLocale());
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
