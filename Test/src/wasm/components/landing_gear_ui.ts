/**
 * LandingGear UI Component
 *
 * Displays the LandingGear section using UIBindings from Rust
 * Matches the original TypeScript 3-column table layout
 */

import { AircraftBridge } from '../aircraft_bridge';
import { localization } from '../localization';
import { BaseComponentUI } from '../base_component_ui';
import {
    createRulesLink,
    createFlexSection,
    updateSelectElement,
    createFlexCheckbox,
    createFlexCheckboxes,
    createFlexSelect,
    createCollapsibleSection,
    StatDisplayConfig,
    createStatsTable,
    updateStatsTable
} from '../dom_utils';

// Cache interface for type safety
interface LandingGearCache {
    typeSelect: HTMLSelectElement;
    retractCheckbox: HTMLInputElement;
    extrasCheckboxes: HTMLInputElement[];
    statsTable: HTMLTableElement;
}

// Landing Gear stats configuration
const GEAR_STATS: StatDisplayConfig[] = [
    { key: 'drag', label: 'Stat Drag', positiveIsGood: false },
    { key: 'mass', label: 'Stat Mass', positiveIsGood: false },
    { key: 'cost', label: 'Stat Cost', positiveIsGood: false },
    { key: 'structure', label: 'Stat Structure', positiveIsGood: true },
    { key: 'crashsafety', label: 'Stat Crash Safety', positiveIsGood: true },
    { key: '', label: '', positiveIsGood: undefined },
];

export class LandingGearUI extends BaseComponentUI {
    private cache: LandingGearCache = undefined;

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

        const bindings = bridge.getLandingGearBindings();

        // Create main table with 3 columns: Landing Gear | Extras | Stats
        const mainTable = document.createElement('table');
        mainTable.style.width = '100%';
        mainTable.id = 'tbl_gear';

        // Header row
        const headerRow = document.createElement('tr');
        const headers = [
            localization.translate('Landing Gear Landing Gear'),
            localization.translate('Landing Gear Extras'),
            localization.translate('Landing Gear Gear Stats')
        ];
        headers.forEach(headerText => {
            const th = document.createElement('th');
            th.textContent = headerText;
            headerRow.appendChild(th);
        });
        mainTable.appendChild(headerRow);

        // Data row
        const UIRow = document.createElement('tr');

        // Landing Gear cell (type select + retractable checkbox)
        const gearCell = document.createElement('td');
        const gearCache = this.createGearSection(gearCell, bindings, bridge);
        UIRow.appendChild(gearCell);

        // Extras cell (list of checkboxes)
        const extrasCell = document.createElement('td');
        const extrasCheckboxes = this.createExtrasSection(extrasCell, bindings, bridge);
        UIRow.appendChild(extrasCell);

        // Stats cell
        const statsCell = document.createElement('td');
        statsCell.className = "inner_table";
        const stats = bridge.getLandingGearStats();
        const statsTable = createStatsTable(stats, GEAR_STATS);
        statsCell.appendChild(statsTable);
        UIRow.appendChild(statsCell);
        mainTable.appendChild(UIRow);

        // Cache elements
        this.cache = {
            ...gearCache,
            extrasCheckboxes,
            statsTable
        };

        // Create collapsible section with localized title
        const sectionTitle = localization.translate('Landing Gear Section Title');
        this.sectionElement = createCollapsibleSection(
            sectionTitle,
            mainTable,
            true // Initially open
        );

        // Add rules link using utility
        const rulesLine = createRulesLink('_Landing_Gear');
        this.sectionElement.insertBefore(
            rulesLine,
            this.sectionElement.children[1]
        );

        this.container.appendChild(this.sectionElement);

        console.log('[LandingGearUI] Full rebuild complete');
    }

    /**
     * Create landing gear section (type select + retractable checkbox)
     */
    private createGearSection(
        cell: HTMLTableCellElement,
        bindings: any,
        bridge: AircraftBridge
    ): {
        typeSelect: HTMLSelectElement;
        retractCheckbox: HTMLInputElement;
    } {
        const flexContainer = createFlexSection();

        // Explicitly handle gear_sel (gear type selector) and retract (retractable checkbox)
        const gearBinding = bindings.gear_sel;
        const retractBinding = bindings.retract;

        // Gear type select using helper
        const typeSelect = gearBinding ? createFlexSelect(
            gearBinding,
            flexContainer,
            (selectedIndex) => {
                const updatedBindings = bridge.getLandingGearBindings();
                updatedBindings.gear_sel.selected = selectedIndex;
                bridge.setLandingGearBindings(updatedBindings);
                this.onUpdate();
            },
            'Type'
        ) : undefined;

        // Retractable checkbox using helper
        const retractCheckbox = retractBinding ? createFlexCheckbox(
            retractBinding,
            flexContainer,
            (checked) => {
                const updatedBindings = bridge.getLandingGearBindings();
                updatedBindings.retract.selected = checked;
                bridge.setLandingGearBindings(updatedBindings);
                this.onUpdate();
            }
        ) : undefined;

        cell.appendChild(flexContainer.div0);
        return { typeSelect, retractCheckbox };
    }

    /**
     * Create extras section (list of checkboxes)
     */
    private createExtrasSection(
        cell: HTMLTableCellElement,
        bindings: any,
        bridge: AircraftBridge
    ): HTMLInputElement[] {
        const flexContainer = createFlexSection();

        // Explicitly handle extra_sel (array of checkbox bindings for extras)
        const extraBinding = bindings.extra_sel;

        if (!extraBinding || !Array.isArray(extraBinding)) {
            cell.appendChild(flexContainer.div0);
            return [];
        }

        // Create checkboxes using helper
        const extrasCheckboxes = createFlexCheckboxes(
            flexContainer,
            extraBinding,
            (idx) => (checked) => {
                const updatedBindings = bridge.getLandingGearBindings();
                updatedBindings.extra_sel[idx].selected = checked;
                bridge.setLandingGearBindings(updatedBindings);
                this.onUpdate();
            }
        );

        cell.appendChild(flexContainer.div0);
        return extrasCheckboxes;
    }

    /**
     * Create stats section (inner table with 5 stats)
     */
    private createStatsSection(cell: HTMLTableCellElement): Map<string, HTMLTableCellElement> {
        cell.className = 'inner_table';
        const statsTable = document.createElement('table');
        statsTable.className = 'inner_table';

        const statCells = new Map<string, HTMLTableCellElement>();

        // Row 1: Drag | Mass | Cost
        const header1 = statsTable.insertRow();
        ['Stat Drag', 'Stat Mass', 'Stat Cost'].forEach(key => {
            const th = document.createElement('th');
            th.textContent = localization.translate(key);
            header1.appendChild(th);
        });

        const data1 = statsTable.insertRow();
        ['drag', 'mass', 'cost'].forEach(key => {
            const td = data1.insertCell();
            td.textContent = '0';
            statCells.set(key, td);
        });

        // Row 2: Structure | Crash Safety | (empty)
        const header2 = statsTable.insertRow();
        const th2_1 = document.createElement('th');
        th2_1.textContent = localization.translate('Stat Structure');
        header2.appendChild(th2_1);
        const th2_2 = document.createElement('th');
        th2_2.textContent = localization.translate('Stat Crash Safety');
        header2.appendChild(th2_2);
        const th2_3 = document.createElement('th');
        th2_3.textContent = '';
        header2.appendChild(th2_3);

        const data2 = statsTable.insertRow();
        const td2_1 = data2.insertCell();
        td2_1.textContent = '0';
        statCells.set('structure', td2_1);
        const td2_2 = data2.insertCell();
        td2_2.textContent = '0';
        statCells.set('crashsafety', td2_2);
        data2.insertCell(); // empty cell

        cell.appendChild(statsTable);
        return statCells;
    }

    /**
     * Update values in existing DOM elements (fast path)
     */
    protected updateValues(): void {
        const bridge = this.getBridgeIfInitialized();
        if (!bridge || !this.cache) return;

        const bindings = bridge.getLandingGearBindings();

        // Update gear type select
        if (this.cache.typeSelect && bindings.gear_sel) {
            updateSelectElement(this.cache.typeSelect, bindings.gear_sel);
        }

        // Update retractable checkbox
        if (this.cache.retractCheckbox && bindings.retract) {
            this.cache.retractCheckbox.checked = bindings.retract.selected;
            this.cache.retractCheckbox.disabled = !bindings.retract.enabled;
        }

        // Update extras checkboxes
        if (bindings.extra_sel && Array.isArray(bindings.extra_sel)) {
            bindings.extra_sel.forEach((binding: any, idx: number) => {
                if (idx < this.cache.extrasCheckboxes.length) {
                    this.cache.extrasCheckboxes[idx].checked = binding.selected;
                    this.cache.extrasCheckboxes[idx].disabled = !binding.enabled;
                }
            });
        }

        // Update stat values
        const stats = bridge.getLandingGearStats();
        updateStatsTable(this.cache.statsTable, stats, GEAR_STATS);
    }
}
