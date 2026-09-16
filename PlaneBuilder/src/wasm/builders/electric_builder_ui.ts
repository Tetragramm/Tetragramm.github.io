/**
 * Electric Motor Builder UI Component
 *
 * UI for configuring electric motors using WASM backend
 */

import { createElectricEngine, EngineInputs, EngineStats } from '../types/engine_inputs';
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
    private nameDisplay: HTMLSpanElement;
    private powerDisplay: HTMLSpanElement;
    private massDisplay: HTMLSpanElement;
    private dragDisplay: HTMLSpanElement;
    private reliabilityDisplay: HTMLSpanElement;
    private chargeDrawDisplay: HTMLSpanElement;
    private overspeedDisplay: HTMLSpanElement;
    private costDisplay: HTMLSpanElement;

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
        this.nameDisplay.textContent = 'Custom Electric Motor';
        outputSection.appendChild(this.nameDisplay);
        this.buildOutputSection(outputSection);
        gridContainer.appendChild(outputSection);

        this.container.appendChild(gridContainer);
    }

    private buildInputSection(container: HTMLElement): void {
        const inputsDiv = document.createElement('div');
        inputsDiv.className = 'engine-builder-inputs';

        const eras: string[] = wasm.getPropellerEras();
        const windings: string[] = wasm.getElectricWindings();

        // Name
        const nameRow = document.createElement('div');
        nameRow.className = 'engine-builder-row';
        const nameLabel = document.createElement('label');
        nameLabel.textContent = localization.translate('Engine Builder Name');
        this.nameInput = document.createElement('input');
        this.nameInput.type = 'text';
        this.nameInput.value = 'Custom Electric Motor';
        this.nameInput.onchange = () => this.updateStats();
        nameRow.appendChild(nameLabel);
        nameRow.appendChild(this.nameInput);
        inputsDiv.appendChild(nameRow);

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

        // Winding
        const windRow = document.createElement('div');
        windRow.className = 'engine-builder-row';
        const windLabel = document.createElement('label');
        windLabel.textContent = localization.translate('Electric Builder Winding');
        this.windingSelect = document.createElement('select');
        windings.forEach((w, i) => {
            const opt = document.createElement('option');
            opt.text = w;
            opt.value = i.toString();
            this.windingSelect.add(opt);
        });
        this.windingSelect.onchange = () => this.updateStats();
        windRow.appendChild(windLabel);
        windRow.appendChild(this.windingSelect);
        inputsDiv.appendChild(windRow);

        // Desired Power
        const powerRow = document.createElement('div');
        powerRow.className = 'engine-builder-row';
        const powerLabel = document.createElement('label');
        powerLabel.textContent = localization.translate('Electric Builder Desired Power');
        this.powerInput = document.createElement('input');
        this.powerInput.type = 'number';
        this.powerInput.min = '0';
        this.powerInput.step = '1';
        this.powerInput.valueAsNumber = 100;
        this.powerInput.onchange = () => this.updateStats();
        powerRow.appendChild(powerLabel);
        powerRow.appendChild(this.powerInput);
        inputsDiv.appendChild(powerRow);

        // Chonk
        const chonkRow = document.createElement('div');
        chonkRow.className = 'engine-builder-row';
        const chonkLabel = document.createElement('label');
        chonkLabel.textContent = localization.translate('Electric Builder Chonk');
        this.chonkInput = document.createElement('input');
        this.chonkInput.type = 'number';
        this.chonkInput.min = '0';
        this.chonkInput.step = '0.1';
        this.chonkInput.valueAsNumber = 1.0;
        this.chonkInput.onchange = () => this.updateStats();
        chonkRow.appendChild(chonkLabel);
        chonkRow.appendChild(this.chonkInput);
        inputsDiv.appendChild(chonkRow);

        // Quality
        const qualRow = document.createElement('div');
        qualRow.className = 'engine-builder-row';
        const qualLabel = document.createElement('label');
        qualLabel.textContent = localization.translate('Electric Builder Quality');
        this.qualityInput = document.createElement('input');
        this.qualityInput.type = 'number';
        this.qualityInput.min = '0.5';
        this.qualityInput.max = '2';
        this.qualityInput.step = '0.05';
        this.qualityInput.valueAsNumber = 1.0;
        this.qualityInput.onchange = () => this.updateStats();
        qualRow.appendChild(qualLabel);
        qualRow.appendChild(this.qualityInput);
        inputsDiv.appendChild(qualRow);

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
        this.chargeDrawDisplay = createStatItem('Electric Builder Charge Draw');
        this.overspeedDisplay = createStatItem('Engine Builder Overspeed');
        this.costDisplay = createStatItem('Engine Builder Cost');

        container.appendChild(statsGrid);
    }

    private updateStats(): void {
        const engineInputs = createElectricEngine(
            this.nameInput.value,
            this.eraSelect.selectedIndex,
            0,
            this.powerInput.valueAsNumber,
            this.windingSelect.selectedIndex,
            this.chonkInput.valueAsNumber,
            this.qualityInput.valueAsNumber
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
        this.chargeDrawDisplay.textContent = this.currentStats.stats.charge.toString();
        this.overspeedDisplay.textContent = this.currentStats.overspeed.toString();
        this.costDisplay.textContent = this.currentStats.stats.cost.toString();
    }

    public getEngineInputs(): EngineInputs {
        return createElectricEngine(
            this.nameInput.value,
            this.eraSelect.selectedIndex,
            0,
            this.powerInput.valueAsNumber,
            this.windingSelect.selectedIndex,
            this.chonkInput.valueAsNumber,
            this.qualityInput.valueAsNumber
        );
    }

    public setEngineInputs(inputs: EngineInputs): void {
        if (!('Electric' in inputs.inputs)) {
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
