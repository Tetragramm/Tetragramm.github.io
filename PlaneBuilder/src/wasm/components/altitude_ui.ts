/**
 * Altitude Effects UI Component
 *
 * Displays altitude effects on aircraft performance with user-controlled view options
 * Based on Test/src/disp/Altitude.ts
 */

import { AircraftBridge, DerivedStats } from '../aircraft_bridge';
import { BaseComponentUI } from '../base_component_ui';
import {
    createCollapsibleSection,
    createFlexCheckbox,
    createRulesLink,
    createMobileOptionItem,
    createMobileSelect,
    createMobileCheckbox
} from '../dom_utils';
import { localization } from '../localization';

enum FUEL_STATE {
    FULLWBOMBS = 0,
    HALFWBOMBS = 1,
    FULL = 2,
    HALF = 3,
}

interface TableCache {
    table: HTMLTableElement;
    headerRow: HTMLTableRowElement;
    dataRows: HTMLTableRowElement[];
}

/**
 * Altitude Effects UI Component
 */
export class AltitudeUI extends BaseComponentUI {
    // Desktop elements
    private desktopTable: TableCache;
    private fuelStateSelect: HTMLSelectElement;
    private firesCheckbox: HTMLInputElement;
    private oxidizedCheckbox: HTMLInputElement;

    // Mobile elements
    private mobileTable: TableCache;
    private mobileFuelStateSelect: HTMLSelectElement;
    private mobileFiresCheckbox: HTMLInputElement;
    private mobileOxidizedCheckbox: HTMLInputElement;

    protected shouldUpdate(): boolean {
        return this.desktopTable !== undefined;
    }

    protected clearCache(): void {
        this.desktopTable = undefined;
        this.mobileTable = undefined;
        this.fuelStateSelect = undefined;
        this.firesCheckbox = undefined;
        this.oxidizedCheckbox = undefined;
        this.mobileFuelStateSelect = undefined;
        this.mobileFiresCheckbox = undefined;
        this.mobileOxidizedCheckbox = undefined;
    }

    /**
     * Full rebuild of the UI structure
     */
    protected rebuildFull(): void {
        this.clearCache();
        this.container.innerHTML = '';

        const bridge = this.getBridgeIfInitialized();
        if (!bridge) return;

        // Create wrapper for both desktop and mobile content
        const contentWrapper = document.createElement('div');

        // === DESKTOP VERSION ===
        const desktopDiv = document.createElement('div');
        desktopDiv.className = 'desktop-only';

        // Get fuel state dropdown
        this.fuelStateSelect = document.createElement('select') as HTMLSelectElement;
        this.fuelStateSelect.innerHTML = '';

        // Add fuel state options
        const options = [
            'Derived Full Fuel with Bombs',
            'Derived Half Fuel with Bombs',
            'Derived Full Fuel',
            'Derived Half Fuel'
        ];

        for (const optText of options) {
            const opt = document.createElement('option');
            opt.textContent = localization.translate(optText);
            this.fuelStateSelect.appendChild(opt);
        }
        this.fuelStateSelect.selectedIndex = FUEL_STATE.FULL;
        this.fuelStateSelect.onchange = () => this.updateValues();

        const span = document.createElement('span');

        this.firesCheckbox = createFlexCheckbox(
            { name: localization.translate('Altitude Eternal Fires'), value: false, enabled: true },
            { div1: span, div2: span },
            (value) => this.updateValues()
        );

        this.oxidizedCheckbox = createFlexCheckbox(
            { name: localization.translate('Altitude Oxidized Fuel'), value: false, enabled: true },
            { div1: span, div2: span },
            (value) => this.updateValues()
        );

        // Create desktop table
        this.desktopTable = this.createTableCache();

        desktopDiv.appendChild(this.fuelStateSelect);
        desktopDiv.appendChild(document.createElement('br'));
        desktopDiv.appendChild(span);
        desktopDiv.appendChild(this.desktopTable.table);
        contentWrapper.appendChild(desktopDiv);

        // === MOBILE VERSION ===
        const mobileDiv = document.createElement('div');
        mobileDiv.className = 'mobile-only mobile-option-group';

        // Mobile fuel state selector
        const fuelItem = createMobileOptionItem(
            '',
            mobileDiv
        );
        const fuelOptions = [
            'Derived Full Fuel with Bombs',
            'Derived Half Fuel with Bombs',
            'Derived Full Fuel',
            'Derived Half Fuel'
        ];
        const fuelBinding = {
            name: localization.translate('Altitude Fuel State'),
            options: fuelOptions.map(opt => ({
                name: localization.translate(opt),
                enabled: true
            })),
            selected: FUEL_STATE.FULL,
            enabled: true
        };
        this.mobileFuelStateSelect = createMobileSelect(
            fuelBinding,
            fuelItem.content,
            (selectedIndex) => {
                this.fuelStateSelect.selectedIndex = selectedIndex;
                this.mobileFuelStateSelect.selectedIndex = selectedIndex;
                this.updateValues();
            }
        );

        // Mobile checkboxes
        const optionsItem = createMobileOptionItem(
            '',
            mobileDiv
        );
        this.mobileFiresCheckbox = createMobileCheckbox(
            { name: localization.translate('Altitude Eternal Fires'), selected: false, enabled: true },
            optionsItem.content,
            (checked) => {
                this.firesCheckbox.checked = checked;
                this.mobileFiresCheckbox.checked = checked;
                this.updateValues();
            }
        );
        this.mobileOxidizedCheckbox = createMobileCheckbox(
            { name: localization.translate('Altitude Oxidized Fuel'), selected: false, enabled: true },
            optionsItem.content,
            (checked) => {
                this.oxidizedCheckbox.checked = checked;
                this.mobileOxidizedCheckbox.checked = checked;
                this.updateValues();
            }
        );

        // Mobile table in scrollable container
        const tableItem = createMobileOptionItem(
            '',
            mobileDiv
        );
        const scrollContainer = document.createElement('div');
        scrollContainer.style.overflowX = 'auto';
        scrollContainer.style.maxWidth = '100%';

        this.mobileTable = this.createTableCache();
        this.mobileTable.table.style.fontSize = '0.9em';

        scrollContainer.appendChild(this.mobileTable.table);
        tableItem.content.appendChild(scrollContainer);

        contentWrapper.appendChild(mobileDiv);

        // Create collapsible section
        const sectionTitle = localization.translate('Altitude Section Title');
        this.sectionElement = createCollapsibleSection(
            sectionTitle,
            contentWrapper,
            false
        );

        // Add rules link using utility
        const rulesLine = createRulesLink('_Altitude_Rules');
        this.sectionElement.insertBefore(
            rulesLine,
            this.sectionElement.children[1]
        );

        this.container.appendChild(this.sectionElement);

        console.log('[AltitudeUI] Full rebuild complete');
        this.updateValues();
    }

    /**
     * Create a table cache with header row
     */
    private createTableCache(): TableCache {
        const table = document.createElement('table');
        const headerRow = document.createElement('tr');

        this.createTH(headerRow, localization.translate('Altitude Altitude'));
        this.createTH(headerRow, localization.translate('Derived Boost'));
        this.createTH(headerRow, localization.translate('Derived Rate of Climb'));
        this.createTH(headerRow, localization.translate('Derived Stall Speed'));
        this.createTH(headerRow, localization.translate('Derived Top Speed'));

        table.appendChild(headerRow);

        return {
            table,
            headerRow,
            dataRows: []
        };
    }

    /**
     * Create a table header cell
     */
    private createTH(row: HTMLTableRowElement, text: string): void {
        const th = document.createElement('th');
        th.textContent = text;
        row.appendChild(th);
    }

    /**
     * Add a data row to a table cache
     */
    private addRowToCache(cache: TableCache, af: number): HTMLTableRowElement {
        const row = document.createElement('tr');
        const afCell = row.insertCell();
        afCell.textContent = `${af * 10}-${af * 10 + 9}`;
        row.insertCell(); // Boost
        row.insertCell(); // RoC
        row.insertCell(); // Stall
        row.insertCell(); // Speed
        cache.dataRows.push(row);
        return row;
    }

    /**
     * Update values in existing DOM elements (fast path)
     */
    protected updateValues(): void {
        const bridge = this.getBridgeIfInitialized();
        if (!bridge || !this.desktopTable) return;

        // Get derived stats
        const derived = bridge.getDerivedStats();

        // Determine which fuel state to use
        let boost = 0;
        let roc = 0;
        let stall = 0;
        let speed = 0;

        const fuelState = this.fuelStateSelect?.selectedIndex ?? FUEL_STATE.FULL;

        switch (fuelState) {
            case FUEL_STATE.FULLWBOMBS:
                boost = derived.boost_full_w_bombs;
                roc = derived.rate_of_climb_w_bombs;
                stall = derived.stall_speed_full_w_bombs;
                speed = derived.max_speed_w_bombs;
                break;
            case FUEL_STATE.HALFWBOMBS:
                boost = Math.floor(1.0e-6 + (derived.boost_empty + derived.boost_full_w_bombs) / 2);
                roc = Math.floor(1.0e-6 + (derived.rate_of_climb_empty + derived.rate_of_climb_w_bombs) / 2);
                stall = Math.floor(1.0e-6 + (derived.stall_speed_empty + derived.stall_speed_full_w_bombs) / 2);
                speed = Math.floor(1.0e-6 + (derived.max_speed_empty + derived.max_speed_w_bombs) / 2);
                break;
            case FUEL_STATE.FULL:
                boost = derived.boost_full;
                roc = derived.rate_of_climb_full;
                stall = derived.stall_speed_full;
                speed = derived.max_speed_full;
                break;
            case FUEL_STATE.HALF:
                boost = Math.floor(1.0e-6 + (derived.boost_empty + derived.boost_full) / 2);
                roc = Math.floor(1.0e-6 + (derived.rate_of_climb_empty + derived.rate_of_climb_full) / 2);
                stall = Math.floor(1.0e-6 + (derived.stall_speed_empty + derived.stall_speed_full) / 2);
                speed = Math.floor(1.0e-6 + (derived.max_speed_empty + derived.max_speed_full) / 2);
                break;
        }

        // Get min/max altitude from aircraft
        const minIAF = Math.floor(bridge.getMinAltitude() / 10);
        const maxIAF = Math.floor(bridge.getMaxAltitude() / 10);

        const firesChecked = this.firesCheckbox?.checked ?? false;
        const oxidizedChecked = this.oxidizedCheckbox?.checked ?? false;

        // Calculate altitude data
        const altitudeData: Array<{ boost: number; roc: number; stall: number; speed: number }> = [];

        for (let af = 0; af < 100; af++) {
            let powerReduction = 0;
            let speedIncrease = 0;

            if (af < minIAF) {
                powerReduction = minIAF - af;
            } else {
                let effectiveMaxIAF = maxIAF;
                if (oxidizedChecked) {
                    effectiveMaxIAF += 3;
                }
                speedIncrease = Math.min(af - minIAF, effectiveMaxIAF - minIAF);
                if (af > effectiveMaxIAF) {
                    powerReduction = af - effectiveMaxIAF;
                }
            }

            if (firesChecked) {
                powerReduction = 0;
            }

            // Calculate adjusted values
            let adjBoost = 0;
            if (powerReduction > 0 && boost !== 0) {
                adjBoost = Math.max(1, boost - 1);
            } else {
                adjBoost = boost;
            }

            const adjRoC = Math.max(1, roc - powerReduction);
            const adjStall = Math.max(1, stall + af);
            const adjSpeed = Math.max(1, speed + speedIncrease - powerReduction);

            altitudeData.push({ boost: adjBoost, roc: adjRoC, stall: adjStall, speed: adjSpeed });

            // Stop if stall speed exceeds top speed
            if (adjStall > adjSpeed) {
                break;
            }
        }

        // Update both tables with the same data
        this.updateTableWithData(this.desktopTable, altitudeData);
        if (this.mobileTable) {
            this.updateTableWithData(this.mobileTable, altitudeData);
        }
    }

    /**
     * Update a table with altitude data
     */
    private updateTableWithData(cache: TableCache, data: Array<{ boost: number; roc: number; stall: number; speed: number }>): void {
        // Clear table except header
        while (cache.table.rows.length > 1) {
            cache.table.deleteRow(1);
        }

        const fragment = document.createDocumentFragment();

        // Ensure we have enough rows in cache
        while (cache.dataRows.length < data.length) {
            this.addRowToCache(cache, cache.dataRows.length);
        }

        // Trim excess rows from cache
        while (cache.dataRows.length > data.length) {
            cache.dataRows.pop();
        }

        // Update row data and add to fragment
        for (let af = 0; af < data.length; af++) {
            const row = cache.dataRows[af];
            const d = data[af];

            row.children[0].textContent = `${af * 10}-${af * 10 + 9}`;
            row.children[1].textContent = d.boost.toString();
            row.children[2].textContent = d.roc.toString();
            row.children[3].textContent = d.stall.toString();
            row.children[4].textContent = d.speed.toString();

            fragment.appendChild(row);
        }

        cache.table.appendChild(fragment);
    }
}
