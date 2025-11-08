/**
 * Stabilizers UI Component
 *
 * Displays the Stabilizers section using UIBindings from Rust
 * Matches the original TypeScript 3-column table layout
 */

import { AircraftBridge } from '../aircraft_bridge';
import { localization } from '../localization';
import { BaseComponentUI } from '../base_component_ui';
import {
    createRulesLink,
    updateSelectElement,
    createFlexSection,
    createFlexNumberInput,
    createSelectElement,
    createCollapsibleSection,
    createStatsTable,
    updateStatsTable,
    StatDisplayConfig
} from '../dom_utils';

// Stabilizer stats configuration
const STABILIZER_STATS: StatDisplayConfig[] = [
    { key: 'drag', label: 'Stat Drag', positiveIsGood: false },
    { key: 'control', label: 'Stat Control', positiveIsGood: true },
    { key: 'cost', label: 'Stat Cost', positiveIsGood: false },
    { key: 'pitchstab', label: 'Stat Pitch Stability', positiveIsGood: true },
    { key: 'latstab', label: 'Stat Lateral Stability', positiveIsGood: true },
    { key: 'liftbleed', label: 'Stat Lift Bleed', positiveIsGood: true },
];

// Cache interface for type safety
interface StabilizersCache {
    hTypeSelect: HTMLSelectElement;
    hCountInput: HTMLInputElement;
    vTypeSelect: HTMLSelectElement;
    vCountInput: HTMLInputElement;
    statsTable: HTMLTableElement;
}

export class StabilizersUI extends BaseComponentUI {
    private cache: StabilizersCache = undefined;

    protected shouldUpdate(): boolean {
        return this.cache !== undefined;
    }

    protected clearCache(): void {
        this.cache = undefined;
    }

    /**
     * Full rebuild of the UI structure (used on first render or locale change)
     */
    protected rebuildFull(): void {
        this.clearCache();
        this.container.innerHTML = '';

        const bridge = this.getBridgeIfInitialized();
        if (!bridge) return;

        const bindings = bridge.getStabilizersBindings();

        // Create main table with 3 columns: Horizontal | Vertical | Stats
        const mainTable = document.createElement('table');
        mainTable.style.width = '100%';
        mainTable.id = 'stab_table';

        // Header row
        const headerRow = document.createElement('tr');
        const headers = [
            localization.translate('Stabilizers Horizontal Stabilizers'),
            localization.translate('Stabilizers Vertical Stabilizers'),
            localization.translate('Stabilizers Stabilizer Stats')
        ];
        headers.forEach(headerText => {
            const th = document.createElement('th');
            th.textContent = headerText;
            headerRow.appendChild(th);
        });
        mainTable.appendChild(headerRow);

        // Data row
        const dataRow = document.createElement('tr');

        // Horizontal stabilizers cell
        const hCell = document.createElement('td');
        const { hTypeSelect, hCountInput } = this.createHorizontalSection(hCell, bindings, bridge);
        dataRow.appendChild(hCell);

        // Vertical stabilizers cell
        const vCell = document.createElement('td');
        const { vTypeSelect, vCountInput } = this.createVerticalSection(vCell, bindings, bridge);
        dataRow.appendChild(vCell);

        // Stats cell
        const statsCell = document.createElement('td');
        statsCell.className = "inner_table";
        let stats = bridge.getStabilizersStats();
        const statsTable = createStatsTable(stats, STABILIZER_STATS);
        statsCell.appendChild(statsTable);
        dataRow.appendChild(statsCell);

        mainTable.appendChild(dataRow);

        // Cache elements
        this.cache = {
            hTypeSelect,
            hCountInput,
            vTypeSelect,
            vCountInput,
            statsTable
        };

        // Create collapsible section with localized title
        const sectionTitle = localization.translate('Stabilizers Section Title');
        this.sectionElement = createCollapsibleSection(
            sectionTitle,
            mainTable,
            true // Initially open
        );

        // Add rules link using utility
        const rulesLine = createRulesLink('_Stabilizers');
        this.sectionElement.insertBefore(
            rulesLine,
            this.sectionElement.children[1]
        );

        this.container.appendChild(this.sectionElement);

        console.log('[StabilizersUI] Full rebuild complete');
    }

    /**
     * Create horizontal stabilizers section
     */
    private createHorizontalSection(
        cell: HTMLTableCellElement,
        bindings: any,
        bridge: AircraftBridge
    ): { hTypeSelect: HTMLSelectElement; hCountInput: HTMLInputElement } {
        const typeBinding = bindings.hstab_sel;
        const countBinding = bindings.hstab_count;

        // Type select using helper
        const hTypeSelect = createSelectElement(
            typeBinding,
            (selectedIndex) => {
                const bindings = bridge.getStabilizersBindings();
                bindings.hstab_sel.selected = selectedIndex;
                bridge.setStabilizersBindings(bindings);
                this.render();
            }
        );

        cell.appendChild(hTypeSelect);
        cell.appendChild(document.createElement('br'));

        // Count input using flex helper
        const flexContainer = createFlexSection();

        // Override the binding name with translated label
        const countBindingWithLabel = { ...countBinding, name: localization.translate('Stabilizers # of Stabilizers') };

        const hCountInput = createFlexNumberInput(
            countBindingWithLabel,
            flexContainer,
            (value) => {
                const bindings = bridge.getStabilizersBindings();
                bindings.hstab_count.value = value;
                bridge.setStabilizersBindings(bindings);
                this.render();
            },
            '0',
            '20'
        );

        cell.appendChild(flexContainer.div0);

        return { hTypeSelect, hCountInput };
    }

    /**
     * Create vertical stabilizers section
     */
    private createVerticalSection(
        cell: HTMLTableCellElement,
        bindings: any,
        bridge: AircraftBridge
    ): { vTypeSelect: HTMLSelectElement; vCountInput: HTMLInputElement } {
        const typeBinding = bindings.vstab_sel;
        const countBinding = bindings.vstab_count;

        // Type select using helper
        const vTypeSelect = createSelectElement(
            typeBinding,
            (selectedIndex) => {
                const bindings = bridge.getStabilizersBindings();
                bindings.vstab_sel.selected = selectedIndex;
                bridge.setStabilizersBindings(bindings);
                this.render();
            }
        );

        cell.appendChild(vTypeSelect);
        cell.appendChild(document.createElement('br'));

        // Count input using flex helper
        const flexContainer = createFlexSection();

        // Override the binding name with translated label
        const countBindingWithLabel = { ...countBinding, name: localization.translate('Stabilizers # of Stabilizers') };

        const vCountInput = createFlexNumberInput(
            countBindingWithLabel,
            flexContainer,
            (value) => {
                const bindings = bridge.getStabilizersBindings();
                bindings.vstab_count.value = value;
                bridge.setStabilizersBindings(bindings);
                this.render();
            },
            '0',
            '20'
        );

        cell.appendChild(flexContainer.div0);

        return { vTypeSelect, vCountInput };
    }

    /**
     * Update values in existing DOM elements (fast path)
     */
    protected updateValues(): void {
        const bridge = this.getBridgeIfInitialized();
        if (!bridge || !this.cache) return;

        const bindings = bridge.getStabilizersBindings();

        // Update horizontal stabilizers
        updateSelectElement(this.cache.hTypeSelect, bindings.hstab_sel);
        this.cache.hCountInput.value = bindings.hstab_count.value.toString();
        this.cache.hCountInput.disabled = !bindings.hstab_count.enabled;

        // Update vertical stabilizers
        updateSelectElement(this.cache.vTypeSelect, bindings.vstab_sel);
        this.cache.vCountInput.value = bindings.vstab_count.value.toString();
        this.cache.vCountInput.disabled = !bindings.vstab_count.enabled;

        // Update stat values
        const stats = bridge.getStabilizersStats();
        updateStatsTable(this.cache.statsTable, stats, STABILIZER_STATS);
    }
}
