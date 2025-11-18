/**
 * Pulsejet Engine Builder UI Component
 *
 * UI for configuring pulsejet engines using WASM backend
 */

import { createPulsejetEngine, EngineInputs, EngineStats } from '../types/engine_inputs';
import { createFlexSection, createFlexNumberInput, createFlexSelect, createFlexCheckbox, createFlexLabel } from '../dom_utils';
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
    private nameDisplay: HTMLSpanElement;
    private powerDisplay: HTMLSpanElement;
    private massDisplay: HTMLSpanElement;
    private dragDisplay: HTMLSpanElement;
    private reliabilityDisplay: HTMLSpanElement;
    private fuelDisplay: HTMLSpanElement;
    private rumbleDisplay: HTMLSpanElement;
    private costDisplay: HTMLSpanElement;
    private altitudeDisplay: HTMLSpanElement;
    private designCostDisplay: HTMLSpanElement;

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
        const stats = document.createElement('th');
        stats.textContent = localization.translate('Engines Engine Stats');
        headerRow.appendChild(stats);


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
        const flex = createFlexSection();
        cell.appendChild(flex.div0);

        // Get table data from WASM
        const valveTypes: string[] = wasm.getPulsejetValveTypes();
        const eras: string[] = wasm.getPropellerEras(); // Pulsejet uses same eras

        // Desired Power
        this.powerInput = createFlexNumberInput(
            { name: localization.translate('Pulsejet Builder Desired Power'), value: 1, enabled: true },
            flex,
            (val) => this.updateStats(),
            '0', undefined, '1'
        );
        // Valve Type
        this.valveTypeSelect = createFlexSelect(
            { name: localization.translate('Pulsejet Builder Valve Type'), options: valveTypes.map(v => ({ name: v, enabled: true })), selected: 0, enabled: true },
            flex,
            () => this.updateStats()
        );

        // Era
        this.eraSelect = createFlexSelect(
            { name: localization.translate('Engine Builder Era'), options: eras.map(e => ({ name: e, enabled: true })), selected: 0, enabled: true },
            flex,
            () => this.updateStats()
        );

        // Quality
        this.qualityInput = createFlexNumberInput(
            { name: localization.translate('Pulsejet Builder Quality'), value: 1, enabled: true },
            flex,
            (val) => this.updateStats(),
            '0', undefined, '0.1'
        );

        // Starter
        this.starterCheckbox = createFlexCheckbox(
            { name: localization.translate('Pulsejet Builder Starter'), selected: false, enabled: true },
            flex,
            () => this.updateStats()
        );
    }

    private buildOutputSection(cell: HTMLTableCellElement): void {
        const flex = createFlexSection();
        cell.appendChild(flex.div0);

        this.nameDisplay = createFlexLabel({ name: localization.translate('Engine Builder Name'), value: '' }, flex);
        this.powerDisplay = createFlexLabel({ name: localization.translate('Engine Builder Power'), value: '0' }, flex);
        this.massDisplay = createFlexLabel({ name: localization.translate('Engine Builder Mass'), value: '0' }, flex);
        this.dragDisplay = createFlexLabel({ name: localization.translate('Engine Builder Drag'), value: '0' }, flex);
        this.reliabilityDisplay = createFlexLabel({ name: localization.translate('Engine Builder Reliability'), value: '0' }, flex);
        this.fuelDisplay = createFlexLabel({ name: localization.translate('Engine Builder Fuel Consumption'), value: '0' }, flex);
        this.rumbleDisplay = createFlexLabel({ name: localization.translate('Pulsejet Builder Rumble'), value: '0' }, flex);
        this.costDisplay = createFlexLabel({ name: localization.translate('Engine Builder Cost'), value: '0' }, flex);
        this.altitudeDisplay = createFlexLabel({ name: localization.translate('Engine Builder Altitude'), value: '0' }, flex);
        this.designCostDisplay = createFlexLabel({ name: localization.translate('Pulsejet Builder Design Cost'), value: '0' }, flex);
    }

    private updateStats(): void {
        const engineInputs = createPulsejetEngine(
            'Custom Pulsejet',
            this.valveTypeSelect.selectedIndex,
            this.eraSelect.selectedIndex,
            0,
            this.powerInput.valueAsNumber,
            this.qualityInput.valueAsNumber,
            this.qualityInput.valueAsNumber,
            this.starterCheckbox.checked
        );

        try {
            const statsJs = wasm.calculateEngineStats(engineInputs);
            this.currentStats = statsJs as EngineStats;
            this.displayStats();
        } catch (e) {
            console.error('Failed to calculate engine stats:', e);
        }
    }

    private displayStats(): void {
        if (!this.currentStats) return;

        console.log(this.currentStats);
        this.nameDisplay.textContent = this.currentStats.name;
        this.powerDisplay.textContent = this.currentStats.stats.power.toString();
        this.massDisplay.textContent = this.currentStats.stats.mass.toString();
        this.dragDisplay.textContent = this.currentStats.stats.drag.toString();
        this.reliabilityDisplay.textContent = this.currentStats.stats.reliability.toString();
        this.fuelDisplay.textContent = this.currentStats.stats.fuelconsumption.toString();
        this.rumbleDisplay.textContent = this.currentStats.rumble.toString();
        this.costDisplay.textContent = this.currentStats.stats.cost.toString();
        this.altitudeDisplay.textContent = this.currentStats.altitude.toString();
        this.designCostDisplay.textContent = '0';
    }

    public getEngineInputs(): EngineInputs {
        return createPulsejetEngine(
            this.currentStats.name,
            this.valveTypeSelect.selectedIndex,
            this.eraSelect.selectedIndex,
            0,
            this.powerInput.valueAsNumber,
            this.qualityInput.valueAsNumber,
            this.qualityInput.valueAsNumber,
            this.starterCheckbox.checked
        );
    }

    public setEngineInputs(inputs: EngineInputs): void {
        if (!('Pulsejet' in inputs.inputs)) {
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
