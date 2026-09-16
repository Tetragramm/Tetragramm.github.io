/**
 * Pulsejet Engine Builder UI Component
 *
 * UI for configuring pulsejet engines using WASM backend
 */

import { createPulsejetEngine, EngineInputs, EngineStats } from '../types/engine_inputs';
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

        // Create responsive grid container
        const gridContainer = document.createElement('div');
        gridContainer.className = 'engine-builder-container';

        // Left section: Input parameters
        const inputSection = document.createElement('div');
        inputSection.className = 'engine-builder-section';
        const inputTitle = document.createElement('div');
        inputTitle.className = 'engine-builder-section-title';
        inputTitle.textContent = localization.translate('Engines Options');
        inputSection.appendChild(inputTitle);
        this.buildInputSection(inputSection);
        gridContainer.appendChild(inputSection);

        // Right section: Output stats
        const outputSection = document.createElement('div');
        outputSection.className = 'engine-builder-section';
        const outputTitle = document.createElement('div');
        outputTitle.className = 'engine-builder-section-title';
        outputTitle.textContent = localization.translate('Engines Engine Stats');
        outputSection.appendChild(outputTitle);
        // Name display in title area
        this.nameDisplay = document.createElement('div');
        this.nameDisplay.className = 'engine-builder-name-display';
        this.nameDisplay.textContent = 'Custom Pulsejet';
        outputSection.appendChild(this.nameDisplay);
        this.buildOutputSection(outputSection);
        gridContainer.appendChild(outputSection);

        this.container.appendChild(gridContainer);
    }

    private buildInputSection(container: HTMLElement): void {
        const inputsDiv = document.createElement('div');
        inputsDiv.className = 'engine-builder-inputs';

        // Get table data from WASM
        const valveTypes: string[] = wasm.getPulsejetValveTypes();
        const eras: string[] = wasm.getPropellerEras();

        // Desired Power
        const powerRow = document.createElement('div');
        powerRow.className = 'engine-builder-row';
        const powerLabel = document.createElement('label');
        powerLabel.textContent = localization.translate('Pulsejet Builder Desired Power');
        this.powerInput = document.createElement('input');
        this.powerInput.type = 'number';
        this.powerInput.min = '0';
        this.powerInput.step = '1';
        this.powerInput.valueAsNumber = 1;
        this.powerInput.onchange = () => this.updateStats();
        powerRow.appendChild(powerLabel);
        powerRow.appendChild(this.powerInput);
        inputsDiv.appendChild(powerRow);

        // Valve Type
        const valveRow = document.createElement('div');
        valveRow.className = 'engine-builder-row';
        const valveLabel = document.createElement('label');
        valveLabel.textContent = localization.translate('Pulsejet Builder Valve Type');
        this.valveTypeSelect = document.createElement('select');
        valveTypes.forEach((v, i) => {
            const opt = document.createElement('option');
            opt.text = v;
            opt.value = i.toString();
            this.valveTypeSelect.add(opt);
        });
        this.valveTypeSelect.onchange = () => this.updateStats();
        valveRow.appendChild(valveLabel);
        valveRow.appendChild(this.valveTypeSelect);
        inputsDiv.appendChild(valveRow);

        // Era
        const eraRow = document.createElement('div');
        eraRow.className = 'engine-builder-row';
        const eraLabel = document.createElement('label');
        eraLabel.textContent = localization.translate('Engine Builder Era');
        this.eraSelect = document.createElement('select');
        eras.forEach((e, i) => {
            const opt = document.createElement('option');
            opt.text = e;
            opt.value = i.toString();
            this.eraSelect.add(opt);
        });
        this.eraSelect.onchange = () => this.updateStats();
        eraRow.appendChild(eraLabel);
        eraRow.appendChild(this.eraSelect);
        inputsDiv.appendChild(eraRow);

        // Quality
        const qualRow = document.createElement('div');
        qualRow.className = 'engine-builder-row';
        const qualLabel = document.createElement('label');
        qualLabel.textContent = localization.translate('Pulsejet Builder Quality');
        this.qualityInput = document.createElement('input');
        this.qualityInput.type = 'number';
        this.qualityInput.min = '0';
        this.qualityInput.step = '0.1';
        this.qualityInput.valueAsNumber = 1;
        this.qualityInput.onchange = () => this.updateStats();
        qualRow.appendChild(qualLabel);
        qualRow.appendChild(this.qualityInput);
        inputsDiv.appendChild(qualRow);

        // Starter
        const starterRow = document.createElement('div');
        starterRow.className = 'engine-builder-row checkbox-row';
        const starterLabel = document.createElement('label');
        this.starterCheckbox = document.createElement('input');
        this.starterCheckbox.type = 'checkbox';
        this.starterCheckbox.onchange = () => this.updateStats();
        const starterText = document.createElement('span');
        starterText.textContent = localization.translate('Pulsejet Builder Starter');
        starterLabel.appendChild(this.starterCheckbox);
        starterLabel.appendChild(starterText);
        starterRow.appendChild(starterLabel);
        inputsDiv.appendChild(starterRow);

        container.appendChild(inputsDiv);
    }

    private buildOutputSection(container: HTMLElement): void {
        const statsGrid = document.createElement('div');
        statsGrid.className = 'engine-builder-stats';

        const createStatItem = (labelKey: string): HTMLSpanElement => {
            const item = document.createElement('div');
            item.className = 'engine-builder-stat-item';
            const label = document.createElement('div');
            label.className = 'engine-builder-stat-label';
            label.textContent = localization.translate(labelKey);
            const value = document.createElement('span');
            value.className = 'engine-builder-stat-value';
            value.textContent = '0';
            item.appendChild(label);
            item.appendChild(value);
            statsGrid.appendChild(item);
            return value;
        };

        this.powerDisplay = createStatItem('Engine Builder Power');
        this.massDisplay = createStatItem('Engine Builder Mass');
        this.dragDisplay = createStatItem('Engine Builder Drag');
        this.reliabilityDisplay = createStatItem('Engine Builder Reliability');
        this.fuelDisplay = createStatItem('Engine Builder Fuel Consumption');
        this.rumbleDisplay = createStatItem('Pulsejet Builder Rumble');
        this.costDisplay = createStatItem('Engine Builder Cost');
        this.altitudeDisplay = createStatItem('Engine Builder Altitude');
        this.designCostDisplay = createStatItem('Pulsejet Builder Design Cost');

        container.appendChild(statsGrid);
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
