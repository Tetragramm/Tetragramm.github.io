/**
 * Stabilizers UI Component
 *
 * Displays the Stabilizers section using UIBindings from Rust
 * Matches the original TypeScript 3-column table layout
 */

import { AircraftBridge } from '../aircraft_bridge';
import { BindingRenderer } from '../binding_renderer';
import { localization } from '../localization';

export class StabilizersUI {
    private container: HTMLElement;
    private renderer: BindingRenderer;
    private sectionElement: HTMLElement | null = null;

    // Cache DOM elements to avoid recreating
    private mainTable: HTMLTableElement | null = null;
    private hTypeSelect: HTMLSelectElement | null = null;
    private hCountInput: HTMLInputElement | null = null;
    private vTypeSelect: HTMLSelectElement | null = null;
    private vCountInput: HTMLInputElement | null = null;
    private statCells: Map<string, HTMLTableCellElement> = new Map();

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
            throw new Error('Bridge not available during StabilizersUI construction');
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
     * Render the Stabilizers UI - intelligently updates or rebuilds
     */
    render(): void {
        const bridge = this.getBridge();
        if (!bridge || !bridge.isInitialized()) {
            console.warn('[StabilizersUI] Bridge not initialized, skipping render');
            return;
        }

        // If we have cached elements, just update values. Otherwise rebuild.
        if (this.mainTable) {
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
        this.mainTable = null;
        this.hTypeSelect = null;
        this.hCountInput = null;
        this.vTypeSelect = null;
        this.vCountInput = null;
        this.statCells.clear();

        // Clear existing content
        this.container.innerHTML = '';

        const bridge = this.getBridge();
        if (!bridge || !bridge.isInitialized()) {
            console.warn('[StabilizersUI] Bridge not initialized, skipping rebuild');
            return;
        }

        const bindings = bridge.getStabilizersBindings();

        // Create main table with 3 columns: Horizontal | Vertical | Stats
        this.mainTable = document.createElement('table');
        this.mainTable.style.width = '100%';
        this.mainTable.id = 'stab_table';

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
        this.mainTable.appendChild(headerRow);

        // Data row
        const dataRow = document.createElement('tr');

        // Horizontal stabilizers cell
        const hCell = document.createElement('td');
        this.createHorizontalSection(hCell, bindings, bridge);
        dataRow.appendChild(hCell);

        // Vertical stabilizers cell
        const vCell = document.createElement('td');
        this.createVerticalSection(vCell, bindings, bridge);
        dataRow.appendChild(vCell);

        // Stats cell
        const statsCell = document.createElement('td');
        this.createStatsSection(statsCell);
        dataRow.appendChild(statsCell);

        this.mainTable.appendChild(dataRow);

        // Update stat values
        this.updateStatValues(bridge);

        // Create collapsible section with localized title
        const sectionTitle = localization.translate('Stabilizers Section Title');
        this.sectionElement = this.renderer.createCollapsibleSection(
            sectionTitle,
            this.mainTable,
            true // Initially open
        );

        // Add rules link
        const rulesLine = document.createElement('h4');
        const rulesLink = document.createElement('a');
        rulesLink.href = './Rules/Rules.htm#_Stabilizers';
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

        console.log('[StabilizersUI] Full rebuild complete');
    }

    /**
     * Create horizontal stabilizers section
     */
    private createHorizontalSection(cell: HTMLTableCellElement, bindings: any, bridge: AircraftBridge): void {
        // Find the hstab_sel and hstab_count bindings
        const typeBinding = bindings.hstab_sel;
        const countBinding = bindings.hstab_count;

        if (typeBinding && typeBinding.options) {
            // Type select
            this.hTypeSelect = document.createElement('select');
            this.hTypeSelect.disabled = !typeBinding.enabled;

            typeBinding.options.forEach((opt: any, idx: number) => {
                const option = document.createElement('option');
                option.value = idx.toString();
                option.textContent = opt.name;
                option.disabled = !opt.enabled;
                if (idx === typeBinding.selected) {
                    option.selected = true;
                }
                this.hTypeSelect!.appendChild(option);
            });

            this.hTypeSelect.addEventListener('change', () => {
                const updatedBindings = bridge.getStabilizersBindings();
                updatedBindings.hstab_sel.selected = parseInt(this.hTypeSelect!.value);
                bridge.setStabilizersBindings(updatedBindings);
                this.render();
            });

            cell.appendChild(this.hTypeSelect);
            cell.appendChild(document.createElement('br'));
        }

        if (countBinding && 'value' in countBinding) {
            // Count input with label
            const label = document.createElement('label');
            label.textContent = localization.translate('Stabilizers # of Stabilizers') + ': ';
            label.style.marginLeft = '0.25em';
            label.style.marginRight = '0.5em';

            this.hCountInput = document.createElement('input');
            this.hCountInput.type = 'number';
            this.hCountInput.min = '0';
            this.hCountInput.max = '20';
            this.hCountInput.value = countBinding.value.toString();
            this.hCountInput.disabled = !countBinding.enabled;
            this.hCountInput.addEventListener('change', () => {
                const updatedBindings = bridge.getStabilizersBindings();
                updatedBindings.hstab_count.value = parseInt(this.hCountInput!.value) || 0;
                bridge.setStabilizersBindings(updatedBindings);
                this.render();
            });

            const span = document.createElement('span');
            span.appendChild(label);
            span.appendChild(this.hCountInput);
            cell.appendChild(span);
        }
    }

    /**
     * Create vertical stabilizers section
     */
    private createVerticalSection(cell: HTMLTableCellElement, bindings: any, bridge: AircraftBridge): void {
        // Find the vstab_sel and vstab_count bindings
        const typeBinding = bindings.vstab_sel;
        const countBinding = bindings.vstab_count;

        if (typeBinding && typeBinding.options) {
            // Type select
            this.vTypeSelect = document.createElement('select');
            this.vTypeSelect.disabled = !typeBinding.enabled;

            typeBinding.options.forEach((opt: any, idx: number) => {
                const option = document.createElement('option');
                option.value = idx.toString();
                option.textContent = opt.name;
                option.disabled = !opt.enabled;
                if (idx === typeBinding.selected) {
                    option.selected = true;
                }
                this.vTypeSelect!.appendChild(option);
            });

            this.vTypeSelect.addEventListener('change', () => {
                const updatedBindings = bridge.getStabilizersBindings();
                updatedBindings.vstab_sel.selected = parseInt(this.vTypeSelect!.value);
                bridge.setStabilizersBindings(updatedBindings);
                this.render();
            });

            cell.appendChild(this.vTypeSelect);
            cell.appendChild(document.createElement('br'));
        }

        if (countBinding && 'value' in countBinding) {
            // Count input with label
            const label = document.createElement('label');
            label.textContent = localization.translate('Stabilizers # of Stabilizers') + ': ';
            label.style.marginLeft = '0.25em';
            label.style.marginRight = '0.5em';

            this.vCountInput = document.createElement('input');
            this.vCountInput.type = 'number';
            this.vCountInput.min = '0';
            this.vCountInput.max = '20';
            this.vCountInput.value = countBinding.value.toString();
            this.vCountInput.disabled = !countBinding.enabled;
            this.vCountInput.addEventListener('change', () => {
                const updatedBindings = bridge.getStabilizersBindings();
                updatedBindings.vstab_count.value = parseInt(this.vCountInput!.value) || 0;
                bridge.setStabilizersBindings(updatedBindings);
                this.render();
            });

            const span = document.createElement('span');
            span.appendChild(label);
            span.appendChild(this.vCountInput);
            cell.appendChild(span);
        }
    }

    /**
     * Create stats section (inner table with 6 stats)
     */
    private createStatsSection(cell: HTMLTableCellElement): void {
        cell.className = 'inner_table';
        const statsTable = document.createElement('table');
        statsTable.className = 'inner_table';

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
            this.statCells.set(key, td);
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
            this.statCells.set(key, td);
        });

        cell.appendChild(statsTable);
    }

    /**
     * Update values in existing DOM elements (fast path)
     */
    private updateValues(): void {
        const bridge = this.getBridge();
        if (!bridge || !bridge.isInitialized()) {
            return;
        }

        const bindings = bridge.getStabilizersBindings();

        // Update horizontal stabilizers
        if (this.hTypeSelect && bindings.hstab_sel) {
            this.hTypeSelect.selectedIndex = bindings.hstab_sel.selected;
            this.hTypeSelect.disabled = !bindings.hstab_sel.enabled;
            bindings.hstab_sel.options.forEach((opt: any, idx: number) => {
                if (idx < this.hTypeSelect!.options.length) {
                    this.hTypeSelect!.options[idx].disabled = !opt.enabled;
                }
            });
        }

        if (this.hCountInput && bindings.hstab_count) {
            this.hCountInput.value = bindings.hstab_count.value.toString();
            this.hCountInput.disabled = !bindings.hstab_count.enabled;
        }

        // Update vertical stabilizers
        if (this.vTypeSelect && bindings.vstab_sel) {
            this.vTypeSelect.selectedIndex = bindings.vstab_sel.selected;
            this.vTypeSelect.disabled = !bindings.vstab_sel.enabled;
            bindings.vstab_sel.options.forEach((opt: any, idx: number) => {
                if (idx < this.vTypeSelect!.options.length) {
                    this.vTypeSelect!.options[idx].disabled = !opt.enabled;
                }
            });
        }

        if (this.vCountInput && bindings.vstab_count) {
            this.vCountInput.value = bindings.vstab_count.value.toString();
            this.vCountInput.disabled = !bindings.vstab_count.enabled;
        }

        // Update stat values
        this.updateStatValues(bridge);
    }

    /**
     * Update stat cell values
     */
    private updateStatValues(bridge: AircraftBridge): void {
        const stats = bridge.getStabilizersStats();

        for (const [key, cell] of this.statCells) {
            const value = stats[key];
            this.blinkIfChanged(cell, value?.toString() || '0', false);
        }
    }

    /**
     * Blink animation when stat changes
     */
    private blinkIfChanged(elem: HTMLTableCellElement, str: string, positiveGood: boolean | null): void {
        if (elem.textContent !== str) {
            elem.textContent = str;
        }
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
        this.mainTable = null;
        this.hTypeSelect = null;
        this.hCountInput = null;
        this.vTypeSelect = null;
        this.vCountInput = null;
        this.statCells.clear();
    }
}
