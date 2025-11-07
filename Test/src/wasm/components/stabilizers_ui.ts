/**
 * Stabilizers UI Component
 *
 * Displays the Stabilizers section using UIBindings from Rust
 * Matches the original TypeScript 3-column table layout
 */

import { AircraftBridge } from '../aircraft_bridge';
import { StatDisplayConfig } from '../binding_renderer';
import { localization } from '../localization';
import { BaseComponentUI } from '../base_component_ui';
import { createRulesLink, updateSelectElement } from '../dom_utils';

// Cache interface for type safety
interface StabilizersCache {
    hTypeSelect: HTMLSelectElement;
    hCountInput: HTMLInputElement;
    vTypeSelect: HTMLSelectElement;
    vCountInput: HTMLInputElement;
    statCells: Map<string, HTMLTableCellElement>;
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
        const statCells = this.createStatsSection(statsCell);
        dataRow.appendChild(statsCell);

        mainTable.appendChild(dataRow);

        // Cache elements
        this.cache = {
            hTypeSelect,
            hCountInput,
            vTypeSelect,
            vCountInput,
            statCells
        };

        // Update stat values
        this.updateStatValues(bridge);

        // Create collapsible section with localized title
        const sectionTitle = localization.translate('Stabilizers Section Title');
        this.sectionElement = this.renderer.createCollapsibleSection(
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

        // Type select
        const hTypeSelect = document.createElement('select');
        hTypeSelect.disabled = !typeBinding.enabled;

        typeBinding.options.forEach((opt: any, idx: number) => {
            const option = document.createElement('option');
            option.value = idx.toString();
            option.textContent = opt.name;
            option.disabled = !opt.enabled;
            if (idx === typeBinding.selected) {
                option.selected = true;
            }
            hTypeSelect.appendChild(option);
        });

        hTypeSelect.addEventListener('change', (event) => {
            const target = event.target as HTMLSelectElement;
            const bindings = bridge.getStabilizersBindings();
            bindings.hstab_sel.selected = parseInt(target.value);
            bridge.setStabilizersBindings(bindings);
            this.render();
        });

        cell.appendChild(hTypeSelect);
        cell.appendChild(document.createElement('br'));

        // Count input with label
        const label = document.createElement('label');
        label.textContent = localization.translate('Stabilizers # of Stabilizers') + ': ';
        label.style.marginLeft = '0.25em';
        label.style.marginRight = '0.5em';

        const hCountInput = document.createElement('input');
        hCountInput.type = 'number';
        hCountInput.min = '0';
        hCountInput.max = '20';
        hCountInput.value = countBinding.value.toString();
        hCountInput.disabled = !countBinding.enabled;
        hCountInput.addEventListener('change', (event) => {
            const target = event.target as HTMLInputElement;
            const bindings = bridge.getStabilizersBindings();
            bindings.hstab_count.value = parseInt(target.value) || 0;
            bridge.setStabilizersBindings(bindings);
            this.render();
        });

        const span = document.createElement('span');
        span.appendChild(label);
        span.appendChild(hCountInput);
        cell.appendChild(span);

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

        // Type select
        const vTypeSelect = document.createElement('select');
        vTypeSelect.disabled = !typeBinding.enabled;

        typeBinding.options.forEach((opt: any, idx: number) => {
            const option = document.createElement('option');
            option.value = idx.toString();
            option.textContent = opt.name;
            option.disabled = !opt.enabled;
            if (idx === typeBinding.selected) {
                option.selected = true;
            }
            vTypeSelect.appendChild(option);
        });

        vTypeSelect.addEventListener('change', (event) => {
            const target = event.target as HTMLSelectElement;
            const bindings = bridge.getStabilizersBindings();
            bindings.vstab_sel.selected = parseInt(target.value);
            bridge.setStabilizersBindings(bindings);
            this.render();
        });

        cell.appendChild(vTypeSelect);
        cell.appendChild(document.createElement('br'));

        // Count input with label
        const label = document.createElement('label');
        label.textContent = localization.translate('Stabilizers # of Stabilizers') + ': ';
        label.style.marginLeft = '0.25em';
        label.style.marginRight = '0.5em';

        const vCountInput = document.createElement('input');
        vCountInput.type = 'number';
        vCountInput.min = '0';
        vCountInput.max = '20';
        vCountInput.value = countBinding.value.toString();
        vCountInput.disabled = !countBinding.enabled;
        vCountInput.addEventListener('change', (event) => {
            const target = event.target as HTMLInputElement;
            const bindings = bridge.getStabilizersBindings();
            bindings.vstab_count.value = parseInt(target.value) || 0;
            bridge.setStabilizersBindings(bindings);
            this.render();
        });

        const span = document.createElement('span');
        span.appendChild(label);
        span.appendChild(vCountInput);
        cell.appendChild(span);

        return { vTypeSelect, vCountInput };
    }

    /**
     * Create stats section (inner table with 6 stats)
     */
    private createStatsSection(cell: HTMLTableCellElement): Map<string, HTMLTableCellElement> {
        cell.className = 'inner_table';
        const statsTable = document.createElement('table');
        statsTable.className = 'inner_table';

        const statCells = new Map<string, HTMLTableCellElement>();

        // Row 1: Drag | Control | Cost
        const header1 = statsTable.insertRow();
        ['Stat Drag', 'Stat Control', 'Stat Cost'].forEach(key => {
            const th = document.createElement('th');
            th.textContent = localization.translate(key);
            header1.appendChild(th);
        });

        const data1 = statsTable.insertRow();
        ['drag', 'control', 'cost'].forEach(key => {
            const td = data1.insertCell();
            td.textContent = '0';
            statCells.set(key, td);
        });

        // Row 2: Pitch Stability | Lateral Stability | Lift Bleed
        const header2 = statsTable.insertRow();
        ['Stat Pitch Stability', 'Stat Lateral Stability', 'Stat Lift Bleed'].forEach(key => {
            const th = document.createElement('th');
            th.textContent = localization.translate(key);
            header2.appendChild(th);
        });

        const data2 = statsTable.insertRow();
        ['pitchstab', 'latstab', 'liftbleed'].forEach(key => {
            const td = data2.insertCell();
            td.textContent = '0';
            statCells.set(key, td);
        });

        cell.appendChild(statsTable);
        return statCells;
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
        this.updateStatValues(bridge);
    }

    /**
     * Update stat cell values
     */
    private updateStatValues(bridge: AircraftBridge): void {
        if (!this.cache) return;

        const stats = bridge.getStabilizersStats();

        for (const [key, cell] of this.cache.statCells) {
            const value = stats[key];
            if (cell.textContent !== (value?.toString() || '0')) {
                cell.textContent = value?.toString() || '0';
            }
        }
    }
}
