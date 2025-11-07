/**
 * Era UI Component
 *
 * Displays the Era selection using UIBindings from Rust
 * Demonstrates the full WASM + localization flow
 */

import { AircraftBridge } from '../aircraft_bridge';
import { StatDisplayConfig } from '../binding_renderer';
import { localization } from '../localization';
import { BaseComponentUI } from '../base_component_ui';
import { createRulesLink, updateSelectElement } from '../dom_utils';

// Era stats configuration (matching original TypeScript: liftbleed, cost, pitchstab)
const ERA_STATS: StatDisplayConfig[] = [
    { key: 'liftbleed', label: 'Stat Lift Bleed', positiveIsGood: false },
    { key: 'cost', label: 'Stat Cost', positiveIsGood: false },
    { key: 'pitchstab', label: 'Stat Pitch Stability', positiveIsGood: true }
];

export class EraUI extends BaseComponentUI {
    // Cache DOM elements to avoid recreating
    private selectElement: HTMLSelectElement = undefined;
    private statCells: HTMLTableCellElement[] = [];

    protected shouldUpdate(): boolean {
        console.log("[EraUI] selectElement is " + this.selectElement);
        return this.selectElement !== undefined;
    }

    protected clearCache(): void {
        this.selectElement = undefined;
        this.statCells = [];
    }

    /**
     * Full rebuild of the UI structure (used on first render or locale change)
     */
    protected rebuildFull(): void {
        this.clearCache();
        this.container.innerHTML = '';

        const bridge = this.getBridgeIfInitialized();
        if (!bridge) {
            console.error('[EraUI] rebuildFull: Bridge not available');
            return;
        }

        console.log('[EraUI] rebuildFull: Starting rebuild');

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

        // Add rules link using utility function
        const rulesLine = createRulesLink('_Era');
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
    protected updateValues(): void {
        const bridge = this.getBridgeIfInitialized();
        if (!bridge || !this.selectElement) return;

        const eraBindings = bridge.getEraBindings();

        // Update select element using utility function
        updateSelectElement(this.selectElement, eraBindings.selected_era);

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
}
