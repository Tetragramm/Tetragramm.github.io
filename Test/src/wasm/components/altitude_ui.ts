/**
 * Altitude Effects UI Component
 *
 * Displays altitude effects on aircraft performance with user-controlled view options
 * Based on Test/src/disp/Altitude.ts
 */

import { AircraftBridge, DerivedStats } from '../aircraft_bridge';
import { BaseComponentUI } from '../base_component_ui';
import { createCollapsibleSection, createFlexCheckbox, createRulesLink } from '../dom_utils';
import { localization } from '../localization';

enum FUEL_STATE {
    FULLWBOMBS = 0,
    HALFWBOMBS = 1,
    FULL = 2,
    HALF = 3,
}

/**
 * Altitude Effects UI Component
 */
export class AltitudeUI extends BaseComponentUI {
    private tbl: HTMLTableElement;
    private fRow: HTMLTableRowElement;
    private rows: HTMLTableRowElement[];

    private fuelStateSelect: HTMLSelectElement;
    private firesCheckbox: HTMLInputElement;
    private oxidizedCheckbox: HTMLInputElement;

    protected shouldUpdate(): boolean {
        return this.tbl !== undefined;
    }

    protected clearCache(): void {
        this.tbl = undefined;
        this.fRow = undefined;
        this.rows = [];
        this.fuelStateSelect = undefined;
        this.firesCheckbox = undefined;
        this.oxidizedCheckbox = undefined;
    }

    /**
     * Full rebuild of the UI structure
     */
    protected rebuildFull(): void {
        this.clearCache();
        this.container.innerHTML = '';

        const bridge = this.getBridgeIfInitialized();
        if (!bridge) return;

        const contentDiv = document.createElement('div');
        // Get table element
        this.tbl = document.createElement('table') as HTMLTableElement;
        if (!this.tbl) {
            console.error('[AltitudeUI] Could not find table_altitude element');
            return;
        }

        // Get fuel state dropdown
        this.fuelStateSelect = document.createElement('select') as HTMLSelectElement;
        if (this.fuelStateSelect) {
            // Clear existing options
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

            this.fuelStateSelect.onchange = () => this.updateValues();
        }

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

        // Create header row
        this.fRow = document.createElement('tr');
        this.createTH(this.fRow, localization.translate('Altitude Altitude'));
        this.createTH(this.fRow, localization.translate('Derived Boost'));
        this.createTH(this.fRow, localization.translate('Derived Rate of Climb'));
        this.createTH(this.fRow, localization.translate('Derived Stall Speed'));
        this.createTH(this.fRow, localization.translate('Derived Top Speed'));

        this.rows = [];

        contentDiv.appendChild(this.fuelStateSelect);
        contentDiv.appendChild(document.createElement('br'));
        contentDiv.appendChild(span);
        contentDiv.appendChild(this.tbl);

        // Create collapsible section
        const sectionTitle = localization.translate('Altitude Section Title');
        this.sectionElement = createCollapsibleSection(
            sectionTitle,
            contentDiv,
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
     * Create a table header cell
     */
    private createTH(row: HTMLTableRowElement, text: string): void {
        const th = document.createElement('th');
        th.textContent = text;
        row.appendChild(th);
    }

    /**
     * Add a row for a specific altitude band
     */
    private addRow(af: number): HTMLTableRowElement {
        const row = document.createElement('tr');
        const afCell = row.insertCell();
        afCell.textContent = `${af * 10}-${af * 10 + 9}`;
        row.insertCell(); // Boost
        row.insertCell(); // RoC
        row.insertCell(); // Stall
        row.insertCell(); // Speed
        this.rows.push(row);
        return row;
    }

    /**
     * Update values in existing DOM elements (fast path)
     */
    protected updateValues(): void {
        const bridge = this.getBridgeIfInitialized();
        if (!bridge || !this.tbl || !this.fRow) return;

        // Clear table
        while (this.tbl.rows.length) {
            this.tbl.deleteRow(0);
        }

        const fragment = document.createDocumentFragment();
        fragment.appendChild(this.fRow);

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

        // Generate rows for each altitude band
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

            // Create row if needed
            if (this.rows.length <= af) {
                this.addRow(af);
            }
            const row = this.rows[af];

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

            // Update row cells
            row.children[1].textContent = adjBoost.toString();
            row.children[2].textContent = adjRoC.toString();
            row.children[3].textContent = adjStall.toString();
            row.children[4].textContent = adjSpeed.toString();

            fragment.appendChild(row);

            // Stop if stall speed exceeds top speed
            if (adjStall > adjSpeed) {
                while (this.rows.length > af + 1) {
                    this.rows.pop();
                }
                break;
            }
        }

        this.tbl.appendChild(fragment);
    }
}
