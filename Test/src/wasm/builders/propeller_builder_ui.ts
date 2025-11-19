/**
 * Propeller Engine Builder UI Component
 *
 * UI for configuring propeller engines using WASM backend
 */

import { createPropellerEngine, EngineInputs, EngineStats } from '../types/engine_inputs';
import { createFlexSection, createFlexNumberInput, createFlexSelect, createFlexCheckbox, createFlexLabel } from '../dom_utils';
import { localization } from '../localization';
import * as wasm from '../../../pkg/flyingcircuswasm';

export class PropellerBuilderUI {
    private container: HTMLElement;
    private wasmModule: any;

    // Input elements
    private nameInput: HTMLInputElement;
    private eraSelect: HTMLSelectElement;
    private coolingSelect: HTMLSelectElement;
    private displacementInput: HTMLInputElement;
    private compressionInput: HTMLInputElement;
    private cylPerRowInput: HTMLInputElement;
    private rowsInput: HTMLInputElement;
    private rpmBoostInput: HTMLInputElement;
    private materialFudgeInput: HTMLInputElement;
    private qualityFudgeInput: HTMLInputElement;
    private compressorTypeSelect: HTMLSelectElement;
    private compressorCountInput: HTMLInputElement;
    private minIdealAltInput: HTMLInputElement;
    private upgradeCheckboxes: HTMLInputElement[] = [];

    // Output elements
    private nameDisplay: HTMLSpanElement;
    private powerDisplay: HTMLSpanElement;
    private massDisplay: HTMLSpanElement;
    private dragDisplay: HTMLSpanElement;
    private reliabilityDisplay: HTMLSpanElement;
    private coolingDisplay: HTMLSpanElement;
    private overspeedDisplay: HTMLSpanElement;
    private fuelDisplay: HTMLSpanElement;
    private altitudeDisplay: HTMLSpanElement;
    private torqueDisplay: HTMLSpanElement;
    private costDisplay: HTMLSpanElement;
    private oilTankDisplay: HTMLSpanElement;
    private gearedRPMDisplay: HTMLSpanElement;

    // Current stats
    private currentStats: EngineStats | null = null;

    constructor(containerId: string, wasmModule: any) {
        const container = document.getElementById(containerId);
        if (!container) {
            throw new Error(`Container ${containerId} not found`);
        }
        this.container = container;
        this.wasmModule = wasmModule;

        this.buildUI();
        this.updateStats();
    }

    private buildUI(): void {
        this.container.innerHTML = '';

        // Create main table structure
        const table = document.createElement('table');
        table.style.width = '100%';

        const headerRow = table.insertRow();
        const input = document.createElement('th');
        input.textContent = localization.translate('Engines Options');
        headerRow.appendChild(input);
        const upgrades = document.createElement('th');
        upgrades.textContent = localization.translate('Engine Upgrades');
        headerRow.appendChild(upgrades);
        const stats = document.createElement('th');
        stats.textContent = localization.translate('Engines Engine Stats');
        headerRow.appendChild(stats);

        const row = table.insertRow();

        // Left column: Input parameters
        const inputCell = row.insertCell();
        inputCell.style.verticalAlign = 'top';
        this.buildInputSection(inputCell);

        // Middle column: Upgrades
        const upgradesCell = row.insertCell();
        upgradesCell.style.verticalAlign = 'top';
        this.buildUpgradesSection(upgradesCell);

        // Right column: Output stats
        const outputCell = row.insertCell();
        outputCell.style.verticalAlign = 'top';
        this.buildOutputSection(outputCell);

        this.container.appendChild(table);
    }

    private buildInputSection(cell: HTMLTableCellElement): void {
        const flex = createFlexSection();
        cell.appendChild(flex.div0);

        // Get table data from WASM
        const eras: string[] = wasm.getPropellerEras();
        const coolingTypes: string[] = wasm.getPropellerCoolingTypes();

        // Name - using regular input since dom_utils doesn't have text input helper
        const nameLabel = document.createElement('label');
        nameLabel.textContent = localization.translate('Engine Builder Name');
        nameLabel.style.marginLeft = '0.25em';
        nameLabel.style.marginRight = '0.5em';
        flex.div1.appendChild(nameLabel);

        this.nameInput = document.createElement('input');
        this.nameInput.type = 'text';
        this.nameInput.className = 'flex-item';
        this.nameInput.value = 'Custom Engine';
        this.nameInput.onchange = () => this.updateStats();
        flex.div2.appendChild(this.nameInput);

        // Era
        this.eraSelect = createFlexSelect(
            { name: localization.translate('Engine Builder Era'), options: eras.map(e => ({ name: e, enabled: true })), selected: 0, enabled: true },
            flex,
            () => this.updateStats()
        );

        // Cooling Type
        this.coolingSelect = createFlexSelect(
            { name: localization.translate('Engine Builder Type'), options: coolingTypes.map(c => ({ name: c, enabled: true })), selected: 0, enabled: true },
            flex,
            () => this.updateStats()
        );

        // Displacement
        this.displacementInput = createFlexNumberInput(
            { name: localization.translate('Engine Builder Displacement'), value: 1, enabled: true },
            flex,
            (val) => this.updateStats(),
            '0.01', undefined, '0.01'
        );

        // Compression Ratio
        this.compressionInput = createFlexNumberInput(
            { name: localization.translate('Engine Builder Compression Ratio'), value: 2, enabled: true },
            flex,
            (val) => this.updateStats(),
            '0.01', undefined, '0.01'
        );

        // Cylinders per Row
        this.cylPerRowInput = createFlexNumberInput(
            { name: localization.translate('Engine Builder Cylinders Per Row'), value: 2, enabled: true },
            flex,
            (val) => this.updateStats(),
            '1', undefined, '1'
        );

        // Number of Rows
        this.rowsInput = createFlexNumberInput(
            { name: localization.translate('Engine Builder Number of Rows'), value: 2, enabled: true },
            flex,
            (val) => this.updateStats(),
            '1', undefined, '1'
        );

        // RPM Boost
        this.rpmBoostInput = createFlexNumberInput(
            { name: localization.translate('Engine Builder RPM Boost'), value: 1, enabled: true },
            flex,
            (val) => this.updateStats(),
            '0.01', '2000', '0.01'
        );

        // Material Fudge
        this.materialFudgeInput = createFlexNumberInput(
            { name: localization.translate('Engine Builder Material Fudge'), value: 1.0, enabled: true },
            flex,
            (val) => this.updateStats(),
            '0.1', '1.9', '0.1'
        );

        // Quality Fudge
        this.qualityFudgeInput = createFlexNumberInput(
            { name: localization.translate('Engine Builder Quality Fudge'), value: 1.0, enabled: true },
            flex,
            (val) => this.updateStats(),
            '0.1', '1.9', '0.1'
        );
    }

    private buildUpgradesSection(cell: HTMLTableCellElement): void {
        const flex = createFlexSection();
        cell.appendChild(flex.div0);

        // Get table data from WASM
        const compressorTypes: string[] = wasm.getPropellerCompressorTypes();

        // Compressor Type
        this.compressorTypeSelect = createFlexSelect(
            { name: localization.translate('Engine Builder Compressor Type'), options: compressorTypes.map(c => ({ name: c, enabled: true })), selected: 0, enabled: true },
            flex,
            () => this.updateStats()
        );

        // Compressor Count
        this.compressorCountInput = createFlexNumberInput(
            { name: localization.translate('Engine Builder Compressor Count'), value: 0, enabled: true },
            flex,
            (val) => this.updateStats(),
            '0', undefined, '1'
        );
        this.compressorCountInput.valueAsNumber = 0;

        // Min Ideal Altitude
        this.minIdealAltInput = createFlexNumberInput(
            { name: localization.translate('Engine Builder Min Ideal Altitude'), value: 0, enabled: true },
            flex,
            (val) => this.updateStats(),
            '0', undefined, '10'
        );
        this.minIdealAltInput.valueAsNumber = 0;

        // Upgrades (checkboxes)
        const upgrades: string[] = wasm.getPropellerUpgrades();
        for (const upgrade of upgrades) {
            const checkbox = createFlexCheckbox(
                { name: upgrade, selected: false, enabled: true },
                flex,
                () => this.updateStats()
            );
            this.upgradeCheckboxes.push(checkbox);
        }
    }

    private buildOutputSection(cell: HTMLTableCellElement): void {
        const flex = createFlexSection();
        cell.appendChild(flex.div0);

        // Name
        this.nameDisplay = createFlexLabel(
            { name: localization.translate('Engine Builder Name'), value: '' },
            flex
        );

        // Power
        this.powerDisplay = createFlexLabel(
            { name: localization.translate('Engine Builder Power'), value: '0' },
            flex
        );

        // Mass
        this.massDisplay = createFlexLabel(
            { name: localization.translate('Engine Builder Mass'), value: '0' },
            flex
        );

        // Drag
        this.dragDisplay = createFlexLabel(
            { name: localization.translate('Engine Builder Drag'), value: '0' },
            flex
        );

        // Reliability
        this.reliabilityDisplay = createFlexLabel(
            { name: localization.translate('Engine Builder Reliability'), value: '0' },
            flex
        );

        // Required Cooling
        this.coolingDisplay = createFlexLabel(
            { name: localization.translate('Engine Builder Required Cooling'), value: '0' },
            flex
        );

        // Overspeed
        this.overspeedDisplay = createFlexLabel(
            { name: localization.translate('Engine Builder Overspeed'), value: '0' },
            flex
        );

        // Fuel Consumption
        this.fuelDisplay = createFlexLabel(
            { name: localization.translate('Engine Builder Fuel Consumption'), value: '0' },
            flex
        );

        // Altitude
        this.altitudeDisplay = createFlexLabel(
            { name: localization.translate('Engine Builder Altitude'), value: '0' },
            flex
        );

        // Torque
        this.torqueDisplay = createFlexLabel(
            { name: localization.translate('Engine Builder Torque'), value: '0' },
            flex
        );

        // Cost
        this.costDisplay = createFlexLabel(
            { name: localization.translate('Engine Builder Cost'), value: '0' },
            flex
        );

        // Oil Tank
        this.oilTankDisplay = createFlexLabel(
            { name: localization.translate('Engine Builder Oil Tank'), value: '0' },
            flex
        );

        // Geared RPM
        this.gearedRPMDisplay = createFlexLabel(
            { name: localization.translate('Engine Builder Geared RPM'), value: '0' },
            flex
        );
    }

    private updateStats(): void {
        // Construct EngineInputs object
        const upgrades = this.upgradeCheckboxes.map(cb => cb.checked);

        const engineInputs = createPropellerEngine(
            this.nameInput.value,
            this.eraSelect.selectedIndex,
            this.coolingSelect.selectedIndex,
            0, // rarity = CUSTOM
            this.displacementInput.valueAsNumber,
            this.compressionInput.valueAsNumber,
            this.cylPerRowInput.valueAsNumber,
            this.rowsInput.valueAsNumber,
            this.rpmBoostInput.valueAsNumber,
            this.materialFudgeInput.valueAsNumber,
            this.qualityFudgeInput.valueAsNumber,
            this.compressorTypeSelect.selectedIndex,
            this.compressorCountInput.valueAsNumber,
            this.minIdealAltInput.valueAsNumber,
            upgrades
        );

        try {
            // Call WASM function to calculate stats
            const statsJs = wasm.calculateEngineStats(engineInputs);
            this.currentStats = statsJs as EngineStats;

            // Update display
            this.displayStats();
        } catch (e) {
            console.error('Failed to calculate engine stats:', e);
        }
    }

    private displayStats(): void {
        if (!this.currentStats) return;

        this.nameDisplay.textContent = this.currentStats.name;
        this.powerDisplay.textContent = this.currentStats.stats.power.toString();
        this.massDisplay.textContent = this.currentStats.stats.mass.toString();
        this.dragDisplay.textContent = this.currentStats.stats.drag.toString();
        this.reliabilityDisplay.textContent = this.currentStats.stats.reliability.toString();
        this.coolingDisplay.textContent = this.currentStats.stats.cooling.toString();
        this.overspeedDisplay.textContent = this.currentStats.overspeed.toString();
        this.fuelDisplay.textContent = this.currentStats.stats.fuelconsumption.toString();

        // Altitude range display
        const minAlt = this.minIdealAltInput.valueAsNumber;
        const maxAlt = minAlt + this.currentStats.altitude;
        this.altitudeDisplay.textContent = `${minAlt}-${maxAlt}`;

        this.torqueDisplay.textContent = this.currentStats.torque.toString();
        this.costDisplay.textContent = this.currentStats.stats.cost.toString();
        this.oilTankDisplay.textContent = this.currentStats.oil_tank > 0
            ? localization.translate('Engine Builder Yes')
            : localization.translate('Engine Builder No');
        this.gearedRPMDisplay.textContent = this.currentStats.es1.toFixed(2);
    }

    /**
     * Get current engine configuration as EngineInputs
     */
    public getEngineInputs(): EngineInputs {
        const upgrades = this.upgradeCheckboxes.map(cb => cb.checked);

        return createPropellerEngine(
            this.nameInput.value,
            this.eraSelect.selectedIndex,
            this.coolingSelect.selectedIndex,
            0, // rarity = CUSTOM
            this.displacementInput.valueAsNumber,
            this.compressionInput.valueAsNumber,
            this.cylPerRowInput.valueAsNumber,
            this.rowsInput.valueAsNumber,
            this.rpmBoostInput.valueAsNumber,
            this.materialFudgeInput.valueAsNumber,
            this.qualityFudgeInput.valueAsNumber,
            this.compressorTypeSelect.selectedIndex,
            this.compressorCountInput.valueAsNumber,
            this.minIdealAltInput.valueAsNumber,
            upgrades
        );
    }

    /**
     * Load engine configuration from EngineInputs
     */
    public setEngineInputs(inputs: EngineInputs): void {
        if (!('Propeller' in inputs.inputs)) {
            console.error('Invalid engine type for propeller builder');
            return;
        }

        const propInputs = (inputs.inputs as any).Propeller;

        this.nameInput.value = inputs.name;
        this.eraSelect.selectedIndex = inputs.era_sel;
        // Note: cooling type stored separately in Rust, need to extract from inputs
        this.displacementInput.valueAsNumber = propInputs.displacement;
        this.compressionInput.valueAsNumber = propInputs.compression;
        this.cylPerRowInput.valueAsNumber = propInputs.cyl_per_row;
        this.rowsInput.valueAsNumber = propInputs.rows;
        this.rpmBoostInput.valueAsNumber = propInputs.rpm_boost;
        this.materialFudgeInput.valueAsNumber = propInputs.material_fudge;
        this.qualityFudgeInput.valueAsNumber = propInputs.quality_fudge;
        this.compressorTypeSelect.selectedIndex = propInputs.compressor_type;
        this.compressorCountInput.valueAsNumber = propInputs.compressor_count;
        this.minIdealAltInput.valueAsNumber = propInputs.min_ideal_alt;

        for (let i = 0; i < this.upgradeCheckboxes.length && i < propInputs.upgrades.length; i++) {
            this.upgradeCheckboxes[i].checked = propInputs.upgrades[i];
        }

        this.updateStats();
    }
}
