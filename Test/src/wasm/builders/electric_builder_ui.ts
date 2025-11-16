/**
 * Electric Motor Builder UI Component
 *
 * UI for configuring electric motors using WASM backend
 */

import { createElectricEngine, EngineInputs, EngineStats } from '../types/engine_inputs';
import { createLabeledInput, createLabeledSelect, createLabeledDisplay, createSection } from './builder_utils';
import { localization } from '../localization';
import * as wasm from '../../../pkg/flyingcircuswasm';

export class ElectricBuilderUI {
    private container: HTMLElement;
    private wasmModule: any;

    // Input elements
    private nameInput: HTMLInputElement;
    private eraSelect: HTMLSelectElement;
    private windingSelect: HTMLSelectElement;
    private powerInput: HTMLInputElement;
    private chonkInput: HTMLInputElement;
    private qualityInput: HTMLInputElement;

    // Output elements
    private nameDisplay: HTMLLabelElement;
    private powerDisplay: HTMLLabelElement;
    private massDisplay: HTMLLabelElement;
    private dragDisplay: HTMLLabelElement;
    private reliabilityDisplay: HTMLLabelElement;
    private chargeDrawDisplay: HTMLLabelElement;
    private overspeedDisplay: HTMLLabelElement;
    private costDisplay: HTMLLabelElement;

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
        const section = createSection('Electric Builder Title');

        // Get table data from WASM
        const eras: string[] = wasm.getPropellerEras(); // Electric uses same eras
        const windings: string[] = wasm.getElectricWindings();

        // Name
        const nameRow = createLabeledInput('Engine Builder Name', 'text');
        this.nameInput = nameRow.input;
        this.nameInput.value = 'Custom Electric Motor';
        this.nameInput.onchange = () => this.updateStats();
        section.appendChild(nameRow.container);

        // Era
        const eraRow = createLabeledSelect('Engine Builder Era', eras);
        this.eraSelect = eraRow.select;
        this.eraSelect.onchange = () => this.updateStats();
        section.appendChild(eraRow.container);

        // Winding
        const windingRow = createLabeledSelect('Electric Builder Winding', windings);
        this.windingSelect = windingRow.select;
        this.windingSelect.onchange = () => this.updateStats();
        section.appendChild(windingRow.container);

        // Desired Power
        const powerRow = createLabeledInput('Electric Builder Desired Power', 'number', '0', undefined, '1');
        this.powerInput = powerRow.input;
        this.powerInput.valueAsNumber = 100;
        this.powerInput.onchange = () => this.updateStats();
        section.appendChild(powerRow.container);

        // Chonk
        const chonkRow = createLabeledInput('Electric Builder Chonk', 'number', '0', undefined, '0.1');
        this.chonkInput = chonkRow.input;
        this.chonkInput.valueAsNumber = 1.0;
        this.chonkInput.onchange = () => this.updateStats();
        section.appendChild(chonkRow.container);

        // Quality
        const qualRow = createLabeledInput('Electric Builder Quality', 'number', '0.5', '2', '0.05');
        this.qualityInput = qualRow.input;
        this.qualityInput.valueAsNumber = 1.0;
        this.qualityInput.onchange = () => this.updateStats();
        section.appendChild(qualRow.container);

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

        // Charge Draw
        const chargeRow = createLabeledDisplay('Electric Builder Charge Draw');
        this.chargeDrawDisplay = chargeRow.display;
        section.appendChild(chargeRow.container);

        // Overspeed
        const overspeedRow = createLabeledDisplay('Engine Builder Overspeed');
        this.overspeedDisplay = overspeedRow.display;
        section.appendChild(overspeedRow.container);

        // Cost
        const costRow = createLabeledDisplay('Engine Builder Cost');
        this.costDisplay = costRow.display;
        section.appendChild(costRow.container);

        cell.appendChild(section);
    }

    private updateStats(): void {
        // Construct EngineInputs object
        const engineInputs = createElectricEngine(
            this.nameInput.value,
            this.eraSelect.selectedIndex,
            0, // rarity = CUSTOM
            this.powerInput.valueAsNumber,
            this.windingSelect.selectedIndex,
            this.chonkInput.valueAsNumber,
            this.qualityInput.valueAsNumber
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
        // Charge draw - need to check if it's in EngineStats
        // For now, placeholder
        this.chargeDrawDisplay.textContent = '0';
        this.overspeedDisplay.textContent = this.currentStats.overspeed.toString();
        this.costDisplay.textContent = this.currentStats.cost.toString();
    }

    /**
     * Get current engine configuration as EngineInputs
     */
    public getEngineInputs(): EngineInputs {
        return createElectricEngine(
            this.nameInput.value,
            this.eraSelect.selectedIndex,
            0, // rarity = CUSTOM
            this.powerInput.valueAsNumber,
            this.windingSelect.selectedIndex,
            this.chonkInput.valueAsNumber,
            this.qualityInput.valueAsNumber
        );
    }

    /**
     * Load engine configuration from EngineInputs
     */
    public setEngineInputs(inputs: EngineInputs): void {
        if (inputs.etype !== 3 || !('Electric' in inputs.inputs)) {
            console.error('Invalid engine type for electric builder');
            return;
        }

        const electricInputs = (inputs.inputs as any).Electric;

        this.nameInput.value = inputs.name;
        this.eraSelect.selectedIndex = inputs.era_sel;
        this.windingSelect.selectedIndex = electricInputs.winding_sel;
        this.powerInput.valueAsNumber = electricInputs.power;
        this.chonkInput.valueAsNumber = electricInputs.chonk;
        this.qualityInput.valueAsNumber = electricInputs.quality_fudge;

        this.updateStats();
    }
}
