/**
 * Optimization UI Component
 *
 * Displays the Optimization section using UIBindings from Rust
 * Includes special checkbox behavior for optimization dots (-3 to +3) with free dot limiting
 */

import { AircraftBridge } from '../aircraft_bridge';
import { localization } from '../localization';
import { BaseComponentUI } from '../base_component_ui';
import {
    createRulesLink,
    createCollapsibleSection,
    createStatsTable,
    updateStatsTable,
    StatDisplayConfig,
    createMobileOptionItem,
    createMobileNumberInput,
    createMobileStatsGrid,
    updateMobileStatsGrid
} from '../dom_utils';

// Cache interface for type safety
interface OptimizationCache {
    freeInput: HTMLInputElement;
    optimizationRows: OptimizationRow[];
    statsTable: HTMLTableElement;
    mobileStatsGrid?: HTMLDivElement;
}

interface OptimizationRow {
    checkboxes: HTMLInputElement[];
    label: string;
    key: string;
}

// Optimization stats configuration
const OPTIMIZATION_STATS: StatDisplayConfig[] = [
    { key: 'cost', label: 'Stat Cost', positiveIsGood: false },
    { key: 'liftbleed', label: 'Stat Lift Bleed', positiveIsGood: false },
    { key: 'escape', label: 'Stat Escape', positiveIsGood: true },
    { key: 'visibility', label: 'Stat Visibility', positiveIsGood: true },
    { key: 'mass', label: 'Stat Mass', positiveIsGood: false },
    { key: 'toughness', label: 'Stat Toughness', positiveIsGood: true },
    { key: 'maxstrain', label: 'Stat Max Strain', positiveIsGood: true },
    { key: 'reliability', label: 'Stat Reliability', positiveIsGood: true },
    { key: 'drag', label: 'Stat Drag', positiveIsGood: false },
];

export class OptimizationUI extends BaseComponentUI {
    private cache: OptimizationCache = undefined;

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

        const bindings = bridge.getOptimizationBindings();

        // Create wrapper for both desktop and mobile content
        const contentWrapper = document.createElement('div');

        // === DESKTOP VERSION ===
        const desktopDiv = document.createElement('div');
        desktopDiv.className = 'desktop-only';

        // Create wrapper div for free optimizations input
        const freeDiv = document.createElement('div');
        freeDiv.style.marginBottom = '10px';

        const freeLabel = document.createElement('label');
        freeLabel.textContent = localization.translate('Optimization Num Free Optimizations') + ': ';
        freeLabel.id = 'lbl_num_opt';
        freeLabel.style.marginRight = '5px';

        const freeInput = document.createElement('input');
        freeInput.type = 'number';
        freeInput.min = '0';
        freeInput.id = 'num_opt';
        freeInput.value = bindings.free_dots?.value?.toString() || '0';
        freeInput.disabled = !bindings.free_dots?.enabled;
        freeInput.addEventListener('change', () => {
            const updatedBindings = bridge.getOptimizationBindings();
            updatedBindings.free_dots.value = parseInt(freeInput.value) || 0;
            bridge.setOptimizationBindings(updatedBindings);
            this.onUpdate();
        });

        freeDiv.appendChild(freeLabel);
        freeDiv.appendChild(freeInput);

        // Create main table with 4 columns: Negative | Effect | Positive | Stats
        const mainTable = document.createElement('table');
        mainTable.style.width = '100%';
        mainTable.id = 'tbl_optimization';

        // Header row
        const headerRow = document.createElement('tr');
        [
            localization.translate('Optimization Negative'),
            localization.translate('Optimization Effect'),
            localization.translate('Optimization Positive'),
            localization.translate('Optimization Optimization Stats')
        ].forEach(headerText => {
            const th = document.createElement('th');
            th.textContent = headerText;
            headerRow.appendChild(th);
        });
        mainTable.appendChild(headerRow);

        // Create optimization rows for all 8 optimization types
        const optimizationTypes = [
            { key: 'cost', label: 'Optimization Cost' },
            { key: 'bleed', label: 'Optimization Lift Bleed' },
            { key: 'escape', label: 'Optimization Leg Room' },
            { key: 'mass', label: 'Optimization Mass' },
            { key: 'toughness', label: 'Optimization Toughness' },
            { key: 'maxstrain', label: 'Optimization Max Strain' },
            { key: 'reliability', label: 'Optimization Reliability' },
            { key: 'drag', label: 'Optimization Drag' }
        ];

        const optimizationRows: OptimizationRow[] = [];

        console.log(bindings);

        optimizationTypes.forEach((opt, idx) => {
            const binding = bindings[opt.key];
            if (!binding) return;

            const { rowElement, rowData } = this.createOptimizationRow(
                opt.key,
                localization.translate(opt.label),
                binding,
                bridge
            );
            mainTable.appendChild(rowElement);
            optimizationRows.push(rowData);

            // Add stats cell to first row only (spans all 8 rows)
            if (idx === 0) {
                const stats = bridge.getOptimizationStats();
                const statsTable = createStatsTable(stats, OPTIMIZATION_STATS);
                const statsCell = document.createElement('td');
                statsCell.rowSpan = 8; // Spans all 8 optimization rows
                statsCell.className = 'inner_table';
                statsCell.appendChild(statsTable);
                rowElement.appendChild(statsCell);

                // Cache the stats table
                this.cache = { freeInput, optimizationRows, statsTable };
            }
        });

        desktopDiv.appendChild(freeDiv);
        desktopDiv.appendChild(mainTable);
        contentWrapper.appendChild(desktopDiv);

        // === MOBILE VERSION ===
        const mobileDiv = document.createElement('div');
        mobileDiv.className = 'mobile-only mobile-option-group';

        // Free Optimizations input
        const freeItem = createMobileOptionItem(
            localization.translate('Optimization Num Free Optimizations'),
            mobileDiv
        );
        createMobileNumberInput(
            bindings.free_dots,
            freeItem.content,
            (value) => {
                const updatedBindings = bridge.getOptimizationBindings();
                updatedBindings.free_dots.value = value;
                bridge.setOptimizationBindings(updatedBindings);
                this.onUpdate();
            },
            0,
            99,
            1
        );

        // Create mobile optimization controls (number inputs -3 to +3)
        optimizationTypes.forEach(opt => {
            const binding = bindings[opt.key];
            if (!binding) return;

            const item = createMobileOptionItem(
                localization.translate(opt.label),
                mobileDiv
            );
            createMobileNumberInput(
                { ...binding, name: '' },
                item.content,
                (value) => {
                    const updatedBindings = bridge.getOptimizationBindings();
                    updatedBindings[opt.key].value = value;
                    bridge.setOptimizationBindings(updatedBindings);
                    this.onUpdate();
                },
                -3,
                3,
                1
            );
        });

        // Mobile stats grid
        const statsItem = createMobileOptionItem(
            localization.translate('Optimization Optimization Stats'),
            mobileDiv
        );
        const stats = bridge.getOptimizationStats();
        const mobileStatsGrid = createMobileStatsGrid(stats, OPTIMIZATION_STATS);
        statsItem.content.appendChild(mobileStatsGrid);
        if (this.cache) {
            this.cache.mobileStatsGrid = mobileStatsGrid;
        }

        contentWrapper.appendChild(mobileDiv);

        // Create collapsible section with localized title
        const sectionTitle = localization.translate('Optimization Section Title');

        this.sectionElement = createCollapsibleSection(
            sectionTitle,
            contentWrapper,
            true // Initially open
        );

        // Add rules link using utility
        const rulesLine = createRulesLink('_Optimization');
        this.sectionElement.insertBefore(
            rulesLine,
            this.sectionElement.children[1]
        );

        this.container.appendChild(this.sectionElement);

        this.updateValues();

        console.log('[OptimizationUI] Full rebuild complete');
    }

    /**
     * Create an optimization row with 6 checkboxes (3 negative, 3 positive)
     */
    private createOptimizationRow(
        key: string,
        label: string,
        binding: any,
        bridge: AircraftBridge
    ): { rowElement: HTMLTableRowElement; rowData: OptimizationRow } {
        const row = document.createElement('tr');
        const checkboxes: HTMLInputElement[] = [];

        // Negative cell (3 checkboxes for -3, -2, -1)
        const negCell = document.createElement('td');
        for (let i = 0; i < 3; i++) {
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';

            const index = i; // Capture for closure
            checkbox.addEventListener('change', () => {
                const updatedBindings = bridge.getOptimizationBindings();
                // Negative checkboxes: when checked use (i-3), when unchecked use (i-2)
                const newValue = checkbox.checked ? (index - 3) : (index - 2);
                updatedBindings[key].value = newValue;
                bridge.setOptimizationBindings(updatedBindings);
                this.onUpdate();
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

            const index = i; // Capture for closure
            checkbox.addEventListener('change', () => {
                const updatedBindings = bridge.getOptimizationBindings();
                // Positive checkboxes: when checked use (i-2), when unchecked use (i-3)
                const newValue = checkbox.checked ? (index - 2) : (index - 3);
                updatedBindings[key].value = newValue;
                bridge.setOptimizationBindings(updatedBindings);
                this.onUpdate();
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
     * Update values in existing DOM elements (fast path)
     */
    protected updateValues(): void {
        const bridge = this.getBridgeIfInitialized();
        if (!bridge || !this.cache) return;

        const bindings = bridge.getOptimizationBindings();

        // Update free dots input
        if (this.cache.freeInput && bindings.free_dots) {
            this.cache.freeInput.value = bindings.free_dots.value.toString();
            this.cache.freeInput.disabled = !bindings.free_dots.enabled;
        }

        // Get available free dots for enabling/disabling positive checkboxes
        const freeDots = bindings.free_dots?.value || 0;

        // Update optimization rows
        this.cache.optimizationRows.forEach(row => {
            const binding = bindings[row.key];
            if (!binding) return;

            const value = binding.value;

            // Update checked state based on value
            this.updateChecked(value, row.checkboxes);

            // Update enabled state for positive checkboxes (only positive checkboxes can be limited by free dots)
            this.updateEnabled(row.checkboxes);
        });

        // Update stats table
        const stats = bridge.getOptimizationStats();
        updateStatsTable(this.cache.statsTable, stats, OPTIMIZATION_STATS);

        // Update mobile stats grid
        if (this.cache.mobileStatsGrid) {
            updateMobileStatsGrid(this.cache.mobileStatsGrid, stats, OPTIMIZATION_STATS);
        }
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
    private updateEnabled(checkboxes: HTMLInputElement[]): void {
        let free = this.getBridge().getOptimizationAvailable();
        for (let i = 0; i < 3; i++) {
            if (checkboxes[i + 3].checked) {
                free++;
            }
            checkboxes[i + 3].disabled = i + 1 > free;
        }
    }

    /**
     * Apply initial collapse state based on whether optimization is at default
     */
    applyInitialCollapseState(): void {
        const bridge = this.getBridgeIfInitialized();
        if (!bridge) return;

        const isDefault = bridge.getOptimizationIsDefault();
        this.setCollapsed(isDefault);
    }
}
