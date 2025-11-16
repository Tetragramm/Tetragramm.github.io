/**
 * Propeller Engine Builder UI Component
 *
 * UI for configuring propeller engines using WASM backend
 */

import { createPropellerEngine, EngineInputs, EngineStats } from '../types/engine_inputs';
import { createLabeledInput, createLabeledSelect, createLabeledCheckbox, createLabeledDisplay, createSection } from './builder_utils';
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
    private nameDisplay: HTMLLabelElement;
    private powerDisplay: HTMLLabelElement;
    private massDisplay: HTMLLabelElement;
    private dragDisplay: HTMLLabelElement;
    private reliabilityDisplay: HTMLLabelElement;
    private coolingDisplay: HTMLLabelElement;
    private overspeedDisplay: HTMLLabelElement;
    private fuelDisplay: HTMLLabelElement;
    private altitudeDisplay: HTMLLabelElement;
    private torqueDisplay: HTMLLabelElement;
    private costDisplay: HTMLLabelElement;
    private oilTankDisplay: HTMLLabelElement;
    private gearedRPMDisplay: HTMLLabelElement;

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
        const section = createSection('Engine Builder Propeller Inputs');

        // Get table data from WASM
        const eras: string[] = wasm.getPropellerEras();
        const coolingTypes: string[] = wasm.getPropellerCoolingTypes();

        // Name
        const nameRow = createLabeledInput('Engine Builder Name', 'text');
        this.nameInput = nameRow.input;
        this.nameInput.value = 'Custom Engine';
        this.nameInput.onchange = () => this.updateStats();
        section.appendChild(nameRow.container);

        // Era
        const eraRow = createLabeledSelect('Engine Builder Era', eras);
        this.eraSelect = eraRow.select;
        this.eraSelect.onchange = () => this.updateStats();
        section.appendChild(eraRow.container);

        // Cooling Type
        const coolingRow = createLabeledSelect('Engine Builder Type', coolingTypes);
        this.coolingSelect = coolingRow.select;
        this.coolingSelect.onchange = () => this.updateStats();
        section.appendChild(coolingRow.container);

        // Displacement
        const dispRow = createLabeledInput('Engine Builder Displacement', 'number', '0.01', undefined, '0.01');
        this.displacementInput = dispRow.input;
        this.displacementInput.valueAsNumber = 10;
        this.displacementInput.onchange = () => this.updateStats();
        section.appendChild(dispRow.container);

        // Compression Ratio
        const comprRow = createLabeledInput('Engine Builder Compression Ratio', 'number', '0.01', undefined, '0.01');
        this.compressionInput = comprRow.input;
        this.compressionInput.valueAsNumber = 5;
        this.compressionInput.onchange = () => this.updateStats();
        section.appendChild(comprRow.container);

        // Cylinders per Row
        const cylRow = createLabeledInput('Engine Builder Cylinders Per Row', 'number', '1', undefined, '1');
        this.cylPerRowInput = cylRow.input;
        this.cylPerRowInput.valueAsNumber = 6;
        this.cylPerRowInput.onchange = () => this.updateStats();
        section.appendChild(cylRow.container);

        // Number of Rows
        const rowsRow = createLabeledInput('Engine Builder Number of Rows', 'number', '1', undefined, '1');
        this.rowsInput = rowsRow.input;
        this.rowsInput.valueAsNumber = 1;
        this.rowsInput.onchange = () => this.updateStats();
        section.appendChild(rowsRow.container);

        // RPM Boost
        const rpmRow = createLabeledInput('Engine Builder RPM Boost', 'number', '0.01', '2000', '0.01');
        this.rpmBoostInput = rpmRow.input;
        this.rpmBoostInput.valueAsNumber = 0;
        this.rpmBoostInput.onchange = () => this.updateStats();
        section.appendChild(rpmRow.container);

        // Material Fudge
        const matRow = createLabeledInput('Engine Builder Material Fudge', 'number', '0.1', '1.9', '0.1');
        this.materialFudgeInput = matRow.input;
        this.materialFudgeInput.valueAsNumber = 1.0;
        this.materialFudgeInput.onchange = () => this.updateStats();
        section.appendChild(matRow.container);

        // Quality Fudge
        const qualRow = createLabeledInput('Engine Builder Quality Fudge', 'number', '0.1', '1.9', '0.1');
        this.qualityFudgeInput = qualRow.input;
        this.qualityFudgeInput.valueAsNumber = 1.0;
        this.qualityFudgeInput.onchange = () => this.updateStats();
        section.appendChild(qualRow.container);

        cell.appendChild(section);
    }

    private buildUpgradesSection(cell: HTMLTableCellElement): void {
        const section = createSection('Engine Builder Upgrades');

        // Get table data from WASM
        const compressorTypes: string[] = wasm.getPropellerCompressorTypes();

        // Compressor Type
        const compRow = createLabeledSelect('Engine Builder Compressor Type', compressorTypes);
        this.compressorTypeSelect = compRow.select;
        this.compressorTypeSelect.onchange = () => this.updateStats();
        section.appendChild(compRow.container);

        // Compressor Count
        const countRow = createLabeledInput('Engine Builder Compressor Count', 'number', '0', undefined, '1');
        this.compressorCountInput = countRow.input;
        this.compressorCountInput.valueAsNumber = 0;
        this.compressorCountInput.onchange = () => this.updateStats();
        section.appendChild(countRow.container);

        // Min Ideal Altitude
        const altRow = createLabeledInput('Engine Builder Min Ideal Altitude', 'number', '0', undefined, '10');
        this.minIdealAltInput = altRow.input;
        this.minIdealAltInput.valueAsNumber = 0;
        this.minIdealAltInput.onchange = () => this.updateStats();
        section.appendChild(altRow.container);

        // Upgrades (checkboxes)
        const upgrades: string[] = wasm.getPropellerUpgrades();
        for (const upgrade of upgrades) {
            const upRow = createLabeledCheckbox(upgrade);
            upRow.checkbox.onchange = () => this.updateStats();
            this.upgradeCheckboxes.push(upRow.checkbox);
            section.appendChild(upRow.container);
        }

        cell.appendChild(section);
    }

    private buildOutputSection(cell: HTMLTableCellElement): void {
        const section = createSection('Engine Builder Outputs');

        // Name
        const nameRow = createLabeledDisplay('Engine Builder Name');
        this.nameDisplay = nameRow.display;
        section.appendChild(nameRow.container);

        // Power
        const powerRow = createLabeledDisplay('Engine Builder Power');
        this.powerDisplay = powerRow.display;
        section.appendChild(powerRow.container);

        // Mass
        const massRow = createLabeledDisplay('Engine Builder Mass');
        this.massDisplay = massRow.display;
        section.appendChild(massRow.container);

        // Drag
        const dragRow = createLabeledDisplay('Engine Builder Drag');
        this.dragDisplay = dragRow.display;
        section.appendChild(dragRow.container);

        // Reliability
        const relyRow = createLabeledDisplay('Engine Builder Reliability');
        this.reliabilityDisplay = relyRow.display;
        section.appendChild(relyRow.container);

        // Required Cooling
        const coolRow = createLabeledDisplay('Engine Builder Required Cooling');
        this.coolingDisplay = coolRow.display;
        section.appendChild(coolRow.container);

        // Overspeed
        const overspeedRow = createLabeledDisplay('Engine Builder Overspeed');
        this.overspeedDisplay = overspeedRow.display;
        section.appendChild(overspeedRow.container);

        // Fuel Consumption
        const fuelRow = createLabeledDisplay('Engine Builder Fuel Consumption');
        this.fuelDisplay = fuelRow.display;
        section.appendChild(fuelRow.container);

        // Altitude
        const altRow = createLabeledDisplay('Engine Builder Altitude');
        this.altitudeDisplay = altRow.display;
        section.appendChild(altRow.container);

        // Torque
        const torqueRow = createLabeledDisplay('Engine Builder Torque');
        this.torqueDisplay = torqueRow.display;
        section.appendChild(torqueRow.container);

        // Cost
        const costRow = createLabeledDisplay('Engine Builder Cost');
        this.costDisplay = costRow.display;
        section.appendChild(costRow.container);

        // Oil Tank
        const oilRow = createLabeledDisplay('Engine Builder Oil Tank');
        this.oilTankDisplay = oilRow.display;
        section.appendChild(oilRow.container);

        // Geared RPM
        const rpmRow = createLabeledDisplay('Engine Builder Geared RPM');
        this.gearedRPMDisplay = rpmRow.display;
        section.appendChild(rpmRow.container);

        cell.appendChild(section);
    }

    private updateStats(): void {
        // Construct EngineInputs object
        const upgrades = this.upgradeCheckboxes.map(cb => cb.checked);

        const engineInputs = createPropellerEngine(
            this.nameInput.value,
            this.eraSelect.selectedIndex,
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

        this.nameDisplay.textContent = this.nameInput.value;
        this.powerDisplay.textContent = this.currentStats.power.toString();
        this.massDisplay.textContent = this.currentStats.mass.toString();
        this.dragDisplay.textContent = this.currentStats.drag.toString();
        this.reliabilityDisplay.textContent = this.currentStats.reliability.toString();
        this.coolingDisplay.textContent = this.currentStats.required_cooling.toString();
        this.overspeedDisplay.textContent = this.currentStats.overspeed.toString();
        this.fuelDisplay.textContent = this.currentStats.fuel_consumption.toString();

        // Altitude range display
        const minAlt = this.minIdealAltInput.valueAsNumber;
        const maxAlt = minAlt + this.currentStats.altitude;
        this.altitudeDisplay.textContent = `${minAlt}-${maxAlt}`;

        this.torqueDisplay.textContent = this.currentStats.torque.toString();
        this.costDisplay.textContent = this.currentStats.cost.toString();
        this.oilTankDisplay.textContent = this.currentStats.oil_tank > 0
            ? localization.translate('Engine Builder Yes')
            : localization.translate('Engine Builder No');
        this.gearedRPMDisplay.textContent = (Math.round(this.currentStats.geared_rpm * 100) / 100).toString();
    }

    /**
     * Get current engine configuration as EngineInputs
     */
    public getEngineInputs(): EngineInputs {
        const upgrades = this.upgradeCheckboxes.map(cb => cb.checked);

        return createPropellerEngine(
            this.nameInput.value,
            this.eraSelect.selectedIndex,
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
        if (inputs.etype !== 0 || !('Propeller' in inputs.inputs)) {
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
