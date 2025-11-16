/**
 * Turbine Engine Builder UI Component
 *
 * UI for configuring turbine engines (jets, turbofans, turboprops) using WASM backend
 */

import { createTurbineEngine, EngineInputs, EngineStats } from '../types/engine_inputs';
import { createLabeledInput, createLabeledSelect, createLabeledCheckbox, createLabeledDisplay, createSection } from './builder_utils';
import { localization } from '../localization';
import * as wasm from '../../../pkg/flyingcircuswasm';

export class TurboBuilderUI {
    private container: HTMLElement;
    private wasmModule: any;

    // Input elements
    private nameInput: HTMLInputElement;
    private eraSelect: HTMLSelectElement;
    private typeSelect: HTMLSelectElement;
    private diameterInput: HTMLInputElement;
    private compressionInput: HTMLInputElement;
    private bypassInput: HTMLInputElement;
    private flowAdjustInput: HTMLInputElement;
    private afterburnerCheckbox: HTMLInputElement;

    // Output elements
    private descriptionCell: HTMLTableCellElement;
    private nameDisplay: HTMLLabelElement;
    private powerDisplay: HTMLLabelElement;
    private massDisplay: HTMLLabelElement;
    private dragDisplay: HTMLLabelElement;
    private reliabilityDisplay: HTMLLabelElement;
    private fuelDisplay: HTMLLabelElement;
    private costDisplay: HTMLLabelElement;
    private altitudeDisplay: HTMLLabelElement;

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

        // Middle column: Description
        this.descriptionCell = row.insertCell();
        this.descriptionCell.style.verticalAlign = 'top';
        this.descriptionCell.style.padding = '10px';
        this.descriptionCell.style.maxWidth = '300px';

        // Right column: Output stats
        const outputCell = row.insertCell();
        outputCell.style.verticalAlign = 'top';
        this.buildOutputSection(outputCell);

        this.container.appendChild(table);
    }

    private buildInputSection(cell: HTMLTableCellElement): void {
        const section = createSection('Turbo Builder Title');

        // Get table data from WASM
        const eras: string[] = wasm.getPropellerEras(); // Turbines use same eras
        const types: string[] = wasm.getTurbineTypes();

        // Name
        const nameRow = createLabeledInput('Engine Builder Name', 'text');
        this.nameInput = nameRow.input;
        this.nameInput.value = 'Custom Turbine';
        this.nameInput.onchange = () => this.updateStats();
        section.appendChild(nameRow.container);

        // Era
        const eraRow = createLabeledSelect('Engine Builder Era', eras);
        this.eraSelect = eraRow.select;
        this.eraSelect.onchange = () => this.updateStats();
        section.appendChild(eraRow.container);

        // Type
        const typeRow = createLabeledSelect('Engine Builder Type', types);
        this.typeSelect = typeRow.select;
        this.typeSelect.onchange = () => this.updateTypeChanged();
        section.appendChild(typeRow.container);

        // Diameter
        const diamRow = createLabeledInput('Turbo Builder Diameter', 'number', '0', undefined, '0.01');
        this.diameterInput = diamRow.input;
        this.diameterInput.valueAsNumber = 1.0;
        this.diameterInput.onchange = () => this.updateStats();
        section.appendChild(diamRow.container);

        // Overall Pressure Ratio
        const comprRow = createLabeledInput('Turbo Builder Overall Pressure Ratio', 'number', '0', undefined, '0.01');
        this.compressionInput = comprRow.input;
        this.compressionInput.valueAsNumber = 10;
        this.compressionInput.onchange = () => this.updateStats();
        section.appendChild(comprRow.container);

        // Bypass Ratio
        const bypassRow = createLabeledInput('Turbo Builder Bypass Ratio', 'number', '0', undefined, '0.1');
        this.bypassInput = bypassRow.input;
        this.bypassInput.valueAsNumber = 0;
        this.bypassInput.onchange = () => this.updateStats();
        section.appendChild(bypassRow.container);

        // Mass Flow Adjustment
        const flowRow = createLabeledInput('Turbo Builder Mass Flow Adjustment', 'number', '-0.5', '0.5', '0.05');
        this.flowAdjustInput = flowRow.input;
        this.flowAdjustInput.valueAsNumber = 0;
        this.flowAdjustInput.onchange = () => this.updateStats();
        section.appendChild(flowRow.container);

        // Afterburner
        const abRow = createLabeledCheckbox('Turbo Builder Afterburner');
        this.afterburnerCheckbox = abRow.checkbox;
        this.afterburnerCheckbox.onchange = () => this.updateStats();
        section.appendChild(abRow.container);

        cell.appendChild(section);
    }

    private buildOutputSection(cell: HTMLTableCellElement): void {
        const section = createSection('Engine Builder Outputs');

        // Name
        const nameRow = createLabeledDisplay('Engine Builder Name');
        this.nameDisplay = nameRow.display;
        section.appendChild(nameRow.container);

        // Power
        const powerRow = createLabeledDisplay('Turbo Builder Thrust');
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

        // Cost
        const costRow = createLabeledDisplay('Engine Builder Cost');
        this.costDisplay = costRow.display;
        section.appendChild(costRow.container);

        // Altitude
        const altRow = createLabeledDisplay('Engine Builder Altitude');
        this.altitudeDisplay = altRow.display;
        section.appendChild(altRow.container);

        cell.appendChild(section);
    }

    private updateTypeChanged(): void {
        // Disable bypass ratio for turbojet and turboprop
        const selectedType = this.typeSelect.selectedIndex;
        if (selectedType === 0 || selectedType === 3) {
            // Turbojet or Turboprop
            this.bypassInput.disabled = true;
        } else {
            // Low Bypass or High Bypass Turbofan
            this.bypassInput.disabled = false;
        }
        this.updateStats();
    }

    private updateStats(): void {
        // Construct EngineInputs object
        const upgrades = [this.afterburnerCheckbox.checked];

        const engineInputs = createTurbineEngine(
            this.nameInput.value,
            this.eraSelect.selectedIndex,
            0, // rarity = CUSTOM
            this.flowAdjustInput.valueAsNumber,
            this.diameterInput.valueAsNumber,
            this.compressionInput.valueAsNumber,
            this.bypassInput.valueAsNumber,
            upgrades
        );

        try {
            // Call WASM function to calculate stats
            const statsJs = wasm.calculateEngineStats(engineInputs);
            this.currentStats = statsJs as EngineStats;

            // Update display
            this.displayStats();
            this.updateDescription();
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
        this.fuelDisplay.textContent = this.currentStats.fuel_consumption.toString();
        this.costDisplay.textContent = this.currentStats.cost.toString();
        this.altitudeDisplay.textContent = this.currentStats.altitude.toString();
    }

    private updateDescription(): void {
        const typeIndex = this.typeSelect.selectedIndex;

        // TODO: Get actual thrust and TSFC values from WASM
        // For now, using placeholder logic
        const thrust = 'N/A';
        const tsfc = 'N/A';

        let description = '';

        switch (typeIndex) {
            case 0: // Turbojet
                description = `<b>Engine Parameters:</b><br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;Thrust = ${thrust} kN<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;Fuel Consumption = ${tsfc} g/(kN*s)<br/>
                    <br/>
                    For a real engine, set the era, total engine diameter (not intake) and OPR. Then
                    adjust the mass flow rate until the Thrust is just below the rated takeoff thrust.<br/>
                    <br/>
                    For a fictional engine, it is not suggested to adjust the mass flow rate.<br/>`;
                break;

            case 1: // Low Bypass Turbofan
                description = `<b>Engine Parameters:</b><br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;Thrust = ${thrust} kN<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;Fuel Consumption = ${tsfc} g/(kN*s)<br/>
                    <br/>
                    For a real engine, set the era, total engine diameter (not intake), Bypass
                    Ratio and OPR. Then adjust the mass flow rate until the Thrust is just below
                    the rated takeoff thrust.<br/>
                    <br/>
                    For a fictional engine, it is not suggested to adjust the mass flow rate.`;
                break;

            case 2: // High Bypass Turbofan
                description = `<b>Engine Parameters:</b><br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;Thrust = ${thrust} kN<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;Fuel Consumption = ${tsfc} g/(kN*s)<br/>
                    <br/>
                    For a real engine, set the era, total diameter of the largest fan, Bypass
                    Ratio and OPR. Then adjust the mass flow rate until the Thrust is just below
                    the rated takeoff thrust.<br/>
                    <br/>
                    For a fictional engine, it is not suggested to adjust the mass flow rate.`;
                break;

            case 3: // Turboprop
                description = `For a real engine, set the era, total engine diameter (not intake), Bypass
                    Ratio and OPR. Then adjust the mass flow rate until the Power is just below
                    the rated takeoff power (in effective shp if available, shp if not). Note
                    that Power = 10*hp<br/>
                    <br/>
                    For a fictional engine, it is not suggested to adjust the mass flow rate.`;
                break;
        }

        this.descriptionCell.innerHTML = description;
    }

    /**
     * Get current engine configuration as EngineInputs
     */
    public getEngineInputs(): EngineInputs {
        const upgrades = [this.afterburnerCheckbox.checked];

        return createTurbineEngine(
            this.nameInput.value,
            this.eraSelect.selectedIndex,
            0, // rarity = CUSTOM
            this.flowAdjustInput.valueAsNumber,
            this.diameterInput.valueAsNumber,
            this.compressionInput.valueAsNumber,
            this.bypassInput.valueAsNumber,
            upgrades
        );
    }

    /**
     * Load engine configuration from EngineInputs
     */
    public setEngineInputs(inputs: EngineInputs): void {
        if (inputs.etype !== 2 || !('Turbine' in inputs.inputs)) {
            console.error('Invalid engine type for turbine builder');
            return;
        }

        const turbineInputs = (inputs.inputs as any).Turbine;

        this.nameInput.value = inputs.name;
        this.eraSelect.selectedIndex = inputs.era_sel;
        // Note: type stored separately, need to extract
        this.flowAdjustInput.valueAsNumber = turbineInputs.flow_adjustment;
        this.diameterInput.valueAsNumber = turbineInputs.diameter;
        this.compressionInput.valueAsNumber = turbineInputs.compression_ratio;
        this.bypassInput.valueAsNumber = turbineInputs.bypass_ratio;
        this.afterburnerCheckbox.checked = turbineInputs.upgrades[0] || false;

        this.updateStats();
    }
}
