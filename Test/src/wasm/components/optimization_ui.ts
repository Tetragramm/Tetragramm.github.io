/**
 * Optimization UI Component
 *
 * Displays the Optimization section using UIBindings from Rust
 * Matches the original TypeScript 4-column table layout with special checkbox behavior
 */

import { AircraftBridge } from '../aircraft_bridge';
import { BindingRenderer } from '../binding_renderer';
import { createCollapsibleSection } from '../dom_utils';
import { localization } from '../localization';

interface OptimizationRow {
    checkboxes: HTMLInputElement[];
    label: string;
    key: string;
}

export class OptimizationUI {
    private container: HTMLElement;
    private renderer: BindingRenderer;
    private sectionElement: HTMLElement | null = null;

    // Cache DOM elements to avoid recreating
    private mainTable: HTMLTableElement | null = null;
    private freeInput: HTMLInputElement | null = null;
    private optimizationRows: OptimizationRow[] = [];
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
            throw new Error('Bridge not available during OptimizationUI construction');
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
     * Render the Optimization UI - intelligently updates or rebuilds
     */
    render(): void {
        const bridge = this.getBridge();
        if (!bridge || !bridge.isInitialized()) {
            console.warn('[OptimizationUI] Bridge not initialized, skipping render');
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
        this.freeInput = null;
        this.optimizationRows = [];
        this.statCells.clear();

        // Clear existing content
        this.container.innerHTML = '';

        const bridge = this.getBridge();
        if (!bridge || !bridge.isInitialized()) {
            console.warn('[OptimizationUI] Bridge not initialized, skipping rebuild');
            return;
        }

        const bindings = bridge.getOptimizationBindings();

        // Create wrapper div for free optimizations input
        const freeDiv = document.createElement('div');
        freeDiv.style.marginBottom = '10px';

        const freeLabel = document.createElement('label');
        freeLabel.textContent = localization.translate('Optimization Num Free Optimizations') + ': ';
        freeLabel.id = 'lbl_num_opt';
        freeLabel.style.marginRight = '5px';

        this.freeInput = document.createElement('input');
        this.freeInput.type = 'number';
        this.freeInput.min = '0';
        this.freeInput.id = 'num_opt';
        this.freeInput.value = bindings.free_dots?.value?.toString() || '0';
        this.freeInput.disabled = !bindings.free_dots?.enabled;
        this.freeInput.addEventListener('change', () => {
            const updatedBindings = bridge.getOptimizationBindings();
            updatedBindings.free_dots.value = parseInt(this.freeInput!.value) || 0;
            bridge.setOptimizationBindings(updatedBindings);
            this.render();
        });

        freeDiv.appendChild(freeLabel);
        freeDiv.appendChild(this.freeInput);

        // Create main table with 4 columns: Negative | Effect | Positive | Stats
        this.mainTable = document.createElement('table');
        this.mainTable.style.width = '100%';
        this.mainTable.id = 'tbl_optimization';

        // Header row
        const headerRow = document.createElement('tr');
        const headers = [
            localization.translate('Optimization Negative'),
            localization.translate('Optimization Effect'),
            localization.translate('Optimization Positive'),
            localization.translate('Optimization Optimization Stats')
        ];
        headers.forEach(headerText => {
            const th = document.createElement('th');
            th.textContent = headerText;
            headerRow.appendChild(th);
        });
        this.mainTable.appendChild(headerRow);

        // Create optimization rows
        const optimizationTypes = [
            { key: 'cost', label: 'Optimization Cost' },
            { key: 'lift_bleed', label: 'Optimization Lift Bleed' },
            { key: 'leg_room', label: 'Optimization Leg Room' },
            { key: 'mass', label: 'Optimization Mass' },
            { key: 'toughness', label: 'Optimization Toughness' },
            { key: 'max_strain', label: 'Optimization Max Strain' },
            { key: 'reliability', label: 'Optimization Reliability' },
            { key: 'drag', label: 'Optimization Drag' }
        ];

        optimizationTypes.forEach((opt, idx) => {
            const binding = bindings[opt.key];
            if (!binding) return;

            const row = this.createOptimizationRow(opt.key, localization.translate(opt.label), binding, bridge);
            this.mainTable!.appendChild(row.rowElement);
            this.optimizationRows.push(row.rowData);

            // Add stats cell to first row only
            if (idx === 0) {
                const statsCell = this.createStatsSection();
                row.rowElement.appendChild(statsCell);
            }
        });

        // Update stat values
        this.updateStatValues(bridge);

        // Create collapsible section with localized title
        const sectionTitle = localization.translate('Optimization Section Title');
        const contentDiv = document.createElement('div');
        contentDiv.appendChild(freeDiv);
        contentDiv.appendChild(this.mainTable);

        this.sectionElement = createCollapsibleSection(
            sectionTitle,
            contentDiv,
            true // Initially open
        );

        // Add rules link
        const rulesLine = document.createElement('h4');
        const rulesLink = document.createElement('a');
        rulesLink.href = './Rules/Rules.htm#_Optimization';
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

        console.log('[OptimizationUI] Full rebuild complete');
    }

    /**
     * Create an optimization row with 6 checkboxes (3 negative, 3 positive)
     */
    private createOptimizationRow(key: string, label: string, binding: any, bridge: AircraftBridge): { rowElement: HTMLTableRowElement, rowData: OptimizationRow } {
        const row = document.createElement('tr');
        const checkboxes: HTMLInputElement[] = [];

        // Negative cell (3 checkboxes for -3, -2, -1)
        const negCell = document.createElement('td');
        for (let i = 0; i < 3; i++) {
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.addEventListener('change', () => {
                const updatedBindings = bridge.getOptimizationBindings();
                // Negative checkboxes: when checked use (i-3), when unchecked use (i-2)
                const newValue = checkbox.checked ? (i - 3) : (i - 2);
                updatedBindings[key].value = newValue;
                bridge.setOptimizationBindings(updatedBindings);
                this.render();
            });
            negCell.appendChild(checkbox);
            checkboxes.push(checkbox);
        }
        row.appendChild(negCell);

        // Effect cell (label)
        const effectCell = document.createElement('td');
        effectCell.textContent = label;
        row.appendChild(effectCell);

        // Positive cell (3 checkboxes for +1, +2, +3)
        const posCell = document.createElement('td');
        for (let i = 3; i < 6; i++) {
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.addEventListener('change', () => {
                const updatedBindings = bridge.getOptimizationBindings();
                // Positive checkboxes: when checked use (i-2), when unchecked use (i-3)
                const newValue = checkbox.checked ? (i - 2) : (i - 3);
                updatedBindings[key].value = newValue;
                bridge.setOptimizationBindings(updatedBindings);
                this.render();
            });
            posCell.appendChild(checkbox);
            checkboxes.push(checkbox);
        }
        row.appendChild(posCell);

        const rowData: OptimizationRow = {
            checkboxes,
            label,
            key
        };

        return { rowElement: row, rowData };
    }

    /**
     * Create stats section (inner table with 9 stats, spans all rows)
     */
    private createStatsSection(): HTMLTableCellElement {
        const statsCell = document.createElement('td');
        statsCell.rowSpan = 8; // Spans all 8 optimization rows
        statsCell.className = 'inner_table';

        const statsTable = document.createElement('table');
        statsTable.className = 'inner_table';

        // Row 1: Cost | Lift Bleed | Escape
        const header1 = statsTable.insertRow();
        ['Stat Cost', 'Stat Lift Bleed', 'Stat Escape'].forEach(key => {
            const th = document.createElement('th');
            th.textContent = localization.translate(key);
            header1.appendChild(th);
        });

        const data1 = statsTable.insertRow();
        ['cost', 'liftbleed', 'escape'].forEach(key => {
            const td = data1.insertCell();
            td.textContent = '0';
            this.statCells.set(key, td);
        });

        // Row 2: Visibility | Mass | Toughness
        const header2 = statsTable.insertRow();
        ['Stat Visibility', 'Stat Mass', 'Stat Toughness'].forEach(key => {
            const th = document.createElement('th');
            th.textContent = localization.translate(key);
            header2.appendChild(th);
        });

        const data2 = statsTable.insertRow();
        ['visibility', 'mass', 'toughness'].forEach(key => {
            const td = data2.insertCell();
            td.textContent = '0';
            this.statCells.set(key, td);
        });

        // Row 3: Max Strain | Reliability | Drag
        const header3 = statsTable.insertRow();
        ['Stat Max Strain', 'Stat Reliability', 'Stat Drag'].forEach(key => {
            const th = document.createElement('th');
            th.textContent = localization.translate(key);
            header3.appendChild(th);
        });

        const data3 = statsTable.insertRow();
        ['maxstrain', 'reliability', 'drag'].forEach(key => {
            const td = data3.insertCell();
            td.textContent = '0';
            this.statCells.set(key, td);
        });

        statsCell.appendChild(statsTable);
        return statsCell;
    }

    /**
     * Update values in existing DOM elements (fast path)
     */
    private updateValues(): void {
        const bridge = this.getBridge();
        if (!bridge || !bridge.isInitialized()) {
            return;
        }

        const bindings = bridge.getOptimizationBindings();

        // Update free dots input
        if (this.freeInput && bindings.free_dots) {
            this.freeInput.value = bindings.free_dots.value.toString();
            this.freeInput.disabled = !bindings.free_dots.enabled;
        }

        // Get available free dots for enabling/disabling positive checkboxes
        const freeDots = bindings.free_dots?.value || 0;

        // Update optimization rows
        this.optimizationRows.forEach(row => {
            const binding = bindings[row.key];
            if (!binding) return;

            const value = binding.value;

            // Update checked state based on value
            this.updateChecked(value, row.checkboxes);

            // Update enabled state for positive checkboxes (only positive checkboxes can be limited by free dots)
            this.updateEnabled(freeDots, row.checkboxes);
        });

        // Update stat values
        this.updateStatValues(bridge);
    }

    /**
     * Update checkbox checked state based on value (-3 to +3)
     * Matches original UpdateChecked logic
     */
    private updateChecked(num: number, checkboxes: HTMLInputElement[]): void {
        // Clear all checkboxes first
        for (let i = 0; i < checkboxes.length; i++) {
            checkboxes[i].checked = false;
        }

        if (num < 0) {
            // Negative: check from right to left (2, then 1, then 0)
            checkboxes[2].checked = true;
            if (num < -1) {
                checkboxes[1].checked = true;
                if (num < -2) {
                    checkboxes[0].checked = true;
                }
            }
        } else if (num > 0) {
            // Positive: check from left to right (3, then 4, then 5)
            checkboxes[3].checked = true;
            if (num > 1) {
                checkboxes[4].checked = true;
                if (num > 2) {
                    checkboxes[5].checked = true;
                }
            }
        }
    }

    /**
     * Update enabled state for positive checkboxes based on available free dots
     * Matches original UpdateEnabled logic
     */
    private updateEnabled(freeDots: number, checkboxes: HTMLInputElement[]): void {
        let free = 0;
        for (let i = 3; i < checkboxes.length; i++) {
            if (!checkboxes[i].checked) {
                free++;
            }
            checkboxes[i].disabled = free > freeDots;
        }
    }

    /**
     * Update stat cell values
     */
    private updateStatValues(bridge: AircraftBridge): void {
        const stats = bridge.getOptimizationStats();

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
        this.freeInput = null;
        this.optimizationRows = [];
        this.statCells.clear();
    }
}
