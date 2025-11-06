/**
 * Era UI Component
 *
 * Displays the Era selection using UIBindings from Rust
 * Demonstrates the full WASM + localization flow
 */

import { AircraftBridge } from '../aircraft_bridge';
import { BindingRenderer, StatDisplayConfig } from '../binding_renderer';
import { localization } from '../localization';

// Era stats configuration (matching original TypeScript: liftbleed, cost, pitchstab)
const ERA_STATS: StatDisplayConfig[] = [
    { key: 'liftbleed', label: 'Stat Lift Bleed', positiveIsGood: false },
    { key: 'cost', label: 'Stat Cost', positiveIsGood: false },
    { key: 'pitchstab', label: 'Stat Pitch Stability', positiveIsGood: true }
];

export class EraUI {
    private container: HTMLElement;
    private renderer: BindingRenderer;
    private sectionElement: HTMLElement | null = null;

    // Cache DOM elements to avoid recreating
    private selectElement: HTMLSelectElement | null = null;
    private statCells: HTMLTableCellElement[] = [];

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
        this.statCells = [];

        // Clear existing content
        this.container.innerHTML = '';

        const bridge = this.getBridge();
        if (!bridge || !bridge.isInitialized()) {
            console.warn('[EraUI] Bridge not initialized, skipping rebuild');
            return;
        }

        const eraBindings = bridge.getEraBindings();

        // Create table for Era selection (matching original TypeScript layout)
        const table = document.createElement('table');
        table.style.width = '100%';
        table.id = 'table_era';

        // Header row with Era Option and stat headers
        const headerRow = document.createElement('tr');
        const headers = [
            localization.translate('Era Option'),
            ...ERA_STATS.map(s => localization.translate(s.label))
        ];
        headers.forEach(headerText => {
            const th = document.createElement('th');
            th.textContent = headerText;
            headerRow.appendChild(th);
        });
        table.appendChild(headerRow);

        // Data row with select and stat cells
        const dataRow = document.createElement('tr');

        // Era select cell
        const selectCell = document.createElement('td');
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
        selectCell.appendChild(this.selectElement);
        dataRow.appendChild(selectCell);

        // Add stat cells
        ERA_STATS.forEach(() => {
            const statCell = document.createElement('td');
            statCell.textContent = '0'; // Initial value
            this.statCells.push(statCell);
            dataRow.appendChild(statCell);
        });

        table.appendChild(dataRow);

        // Update stat values
        this.updateStatValues(bridge);

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

        // Update stat values
        this.updateStatValues(bridge);
    }

    /**
     * Update stat cell values
     */
    private updateStatValues(bridge: AircraftBridge): void {
        const stats = bridge.getEraStats();
        ERA_STATS.forEach((config, idx) => {
            if (idx < this.statCells.length) {
                const value = stats[config.key];
                this.statCells[idx].textContent = value?.toString() || '0';
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
