/**
 * Pulsejet Engine Builder UI Component
 *
 * UI for configuring pulsejet engines using WASM backend
 */

import { createPulsejetEngine, EngineInputs, EngineStats } from '../types/engine_inputs';
import { createLabeledInput, createLabeledSelect, createLabeledCheckbox, createLabeledDisplay, createSection } from './builder_utils';
import { localization } from '../localization';
import * as wasm from '../../../pkg/flyingcircuswasm';

export class PulsejetBuilderUI {
    private container: HTMLElement;
    private wasmModule: any;

    // Input elements
    private powerInput: HTMLInputElement;
    private valveTypeSelect: HTMLSelectElement;
    private eraSelect: HTMLSelectElement;
    private qualityInput: HTMLInputElement;
    private starterCheckbox: HTMLInputElement;

    // Output elements
    private nameDisplay: HTMLLabelElement;
    private powerDisplay: HTMLLabelElement;
    private massDisplay: HTMLLabelElement;
    private dragDisplay: HTMLLabelElement;
    private reliabilityDisplay: HTMLLabelElement;
    private fuelDisplay: HTMLLabelElement;
    private rumbleDisplay: HTMLLabelElement;
    private costDisplay: HTMLLabelElement;
    private altitudeDisplay: HTMLLabelElement;
    private designCostDisplay: HTMLLabelElement;

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

        // Right column: Output stats
        const outputCell = row.insertCell();
        outputCell.style.verticalAlign = 'top';
        this.buildOutputSection(outputCell);

        this.container.appendChild(table);
    }

    private buildInputSection(cell: HTMLTableCellElement): void {
        const section = createSection('Pulsejet Builder Title');

        // Get table data from WASM
        const valveTypes: string[] = wasm.getPulsejetValveTypes();
        const eras: string[] = wasm.getPropellerEras(); // Pulsejet uses same eras

        // Desired Power
        const powerRow = createLabeledInput('Pulsejet Builder Desired Power', 'number', '0', undefined, '1');
        this.powerInput = powerRow.input;
        this.powerInput.valueAsNumber = 100;
        this.powerInput.onchange = () => this.updateStats();
        section.appendChild(powerRow.container);

        // Valve Type
        const valveRow = createLabeledSelect('Pulsejet Builder Valve Type', valveTypes);
        this.valveTypeSelect = valveRow.select;
        this.valveTypeSelect.onchange = () => this.updateStats();
        section.appendChild(valveRow.container);

        // Era
        const eraRow = createLabeledSelect('Engine Builder Era', eras);
        this.eraSelect = eraRow.select;
        this.eraSelect.onchange = () => this.updateStats();
        section.appendChild(eraRow.container);

        // Quality
        const qualRow = createLabeledInput('Pulsejet Builder Quality', 'number', '0', undefined, '0.1');
        this.qualityInput = qualRow.input;
        this.qualityInput.valueAsNumber = 0;
        this.qualityInput.onchange = () => this.updateStats();
        section.appendChild(qualRow.container);

        // Starter
        const starterRow = createLabeledCheckbox('Pulsejet Builder Starter');
        this.starterCheckbox = starterRow.checkbox;
        this.starterCheckbox.onchange = () => this.updateStats();
        section.appendChild(starterRow.container);

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

        // Fuel Consumption
        const fuelRow = createLabeledDisplay('Engine Builder Fuel Consumption');
        this.fuelDisplay = fuelRow.display;
        section.appendChild(fuelRow.container);

        // Rumble
        const rumbleRow = createLabeledDisplay('Pulsejet Builder Rumble');
        this.rumbleDisplay = rumbleRow.display;
        section.appendChild(rumbleRow.container);

        // Cost
        const costRow = createLabeledDisplay('Engine Builder Cost');
        this.costDisplay = costRow.display;
        section.appendChild(costRow.container);

        // Altitude
        const altRow = createLabeledDisplay('Engine Builder Altitude');
        this.altitudeDisplay = altRow.display;
        section.appendChild(altRow.container);

        // Design Cost
        const designCostRow = createLabeledDisplay('Pulsejet Builder Design Cost');
        this.designCostDisplay = designCostRow.display;
        section.appendChild(designCostRow.container);

        cell.appendChild(section);
    }

    private updateStats(): void {
        // Construct EngineInputs object
        const engineInputs = createPulsejetEngine(
            'Custom Pulsejet',
            this.eraSelect.selectedIndex,
            0, // rarity = CUSTOM
            this.powerInput.valueAsNumber,
            this.qualityInput.valueAsNumber, // quality_cost
            this.qualityInput.valueAsNumber, // quality_reliability (same as cost)
            this.starterCheckbox.checked
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

        this.nameDisplay.textContent = 'Custom Pulsejet';
        this.powerDisplay.textContent = this.currentStats.power.toString();
        this.massDisplay.textContent = this.currentStats.mass.toString();
        this.dragDisplay.textContent = this.currentStats.drag.toString();
        this.reliabilityDisplay.textContent = this.currentStats.reliability.toString();
        this.fuelDisplay.textContent = this.currentStats.fuel_consumption.toString();
        // Rumble is stored in... where? Need to check if it's in EngineStats
        // For now, leaving as placeholder
        this.rumbleDisplay.textContent = '0';
        this.costDisplay.textContent = this.currentStats.cost.toString();
        this.altitudeDisplay.textContent = this.currentStats.altitude.toString();
        // Design cost - need to calculate separately or get from WASM
        // For now, placeholder
        this.designCostDisplay.textContent = '0';
    }

    /**
     * Get current engine configuration as EngineInputs
     */
    public getEngineInputs(): EngineInputs {
        return createPulsejetEngine(
            'Custom Pulsejet',
            this.eraSelect.selectedIndex,
            0, // rarity = CUSTOM
            this.powerInput.valueAsNumber,
            this.qualityInput.valueAsNumber,
            this.qualityInput.valueAsNumber,
            this.starterCheckbox.checked
        );
    }

    /**
     * Load engine configuration from EngineInputs
     */
    public setEngineInputs(inputs: EngineInputs): void {
        if (inputs.etype !== 1 || !('Pulsejet' in inputs.inputs)) {
            console.error('Invalid engine type for pulsejet builder');
            return;
        }

        const pulseInputs = (inputs.inputs as any).Pulsejet;

        this.eraSelect.selectedIndex = inputs.era_sel;
        this.powerInput.valueAsNumber = pulseInputs.power;
        this.qualityInput.valueAsNumber = pulseInputs.quality_cost;
        this.starterCheckbox.checked = pulseInputs.starter;

        this.updateStats();
    }
}
