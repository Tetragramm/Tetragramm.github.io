/**
 * Turbine Engine Builder UI Component
 *
 * UI for configuring turbine engines (jets, turbofans, turboprops) using WASM backend
 */

import { createTurbineEngine, EngineInputs, EngineStats } from '../types/engine_inputs';
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
    private descriptionCell: HTMLElement;
    private nameDisplay: HTMLSpanElement;
    private powerDisplay: HTMLSpanElement;
    private massDisplay: HTMLSpanElement;
    private dragDisplay: HTMLSpanElement;
    private reliabilityDisplay: HTMLSpanElement;
    private fuelDisplay: HTMLSpanElement;
    private costDisplay: HTMLSpanElement;
    private altitudeDisplay: HTMLSpanElement;

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
        gridContainer.className = 'engine-builder-container three-column';

        // Left section: Input parameters
        const inputSection = document.createElement('div');
        inputSection.className = 'engine-builder-section';
        const inputTitle = document.createElement('div');
        inputTitle.className = 'engine-builder-section-title';
        inputTitle.textContent = localization.translate('Engines Options');
        inputSection.appendChild(inputTitle);
        this.buildInputSection(inputSection);
        gridContainer.appendChild(inputSection);

        // Middle section: Description
        const descSection = document.createElement('div');
        descSection.className = 'engine-builder-section';
        const descTitle = document.createElement('div');
        descTitle.className = 'engine-builder-section-title';
        descTitle.textContent = localization.translate('Used Description');
        descSection.appendChild(descTitle);
        this.descriptionCell = document.createElement('div');
        this.descriptionCell.className = 'engine-builder-description';
        descSection.appendChild(this.descriptionCell);
        gridContainer.appendChild(descSection);

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
        this.nameDisplay.textContent = 'Custom Turbine';
        outputSection.appendChild(this.nameDisplay);
        this.buildOutputSection(outputSection);
        gridContainer.appendChild(outputSection);

        this.container.appendChild(gridContainer);

        this.updateTypeChanged();
    }

    private buildInputSection(container: HTMLElement): void {
        const inputsDiv = document.createElement('div');
        inputsDiv.className = 'engine-builder-inputs';

        const eras: string[] = wasm.getTurbineEras();
        const types: string[] = wasm.getTurbineTypes();

        // Name
        const nameRow = document.createElement('div');
        nameRow.className = 'engine-builder-row';
        const nameLabel = document.createElement('label');
        nameLabel.textContent = localization.translate('Engine Builder Name');
        this.nameInput = document.createElement('input');
        this.nameInput.type = 'text';
        this.nameInput.value = 'Custom Turbine';
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

        // Type
        const typeRow = document.createElement('div');
        typeRow.className = 'engine-builder-row';
        const typeLabel = document.createElement('label');
        typeLabel.textContent = localization.translate('Engine Builder Type');
        this.typeSelect = document.createElement('select');
        types.forEach((t, i) => {
            const opt = document.createElement('option');
            opt.text = t;
            opt.value = i.toString();
            this.typeSelect.add(opt);
        });
        this.typeSelect.onchange = () => this.updateTypeChanged();
        typeRow.appendChild(typeLabel);
        typeRow.appendChild(this.typeSelect);
        inputsDiv.appendChild(typeRow);

        // Diameter
        const diamRow = document.createElement('div');
        diamRow.className = 'engine-builder-row';
        const diamLabel = document.createElement('label');
        diamLabel.textContent = localization.translate('Turbo Builder Diameter');
        this.diameterInput = document.createElement('input');
        this.diameterInput.type = 'number';
        this.diameterInput.min = '0';
        this.diameterInput.step = '0.01';
        this.diameterInput.valueAsNumber = 1.0;
        this.diameterInput.onchange = () => this.updateStats();
        diamRow.appendChild(diamLabel);
        diamRow.appendChild(this.diameterInput);
        inputsDiv.appendChild(diamRow);

        // Overall Pressure Ratio
        const compRow = document.createElement('div');
        compRow.className = 'engine-builder-row';
        const compLabel = document.createElement('label');
        compLabel.textContent = localization.translate('Turbo Builder Overall Pressure Ratio');
        this.compressionInput = document.createElement('input');
        this.compressionInput.type = 'number';
        this.compressionInput.min = '0';
        this.compressionInput.step = '0.01';
        this.compressionInput.valueAsNumber = 10;
        this.compressionInput.onchange = () => this.updateStats();
        compRow.appendChild(compLabel);
        compRow.appendChild(this.compressionInput);
        inputsDiv.appendChild(compRow);

        // Bypass Ratio
        const bypassRow = document.createElement('div');
        bypassRow.className = 'engine-builder-row';
        const bypassLabel = document.createElement('label');
        bypassLabel.textContent = localization.translate('Turbo Builder Bypass Ratio');
        this.bypassInput = document.createElement('input');
        this.bypassInput.type = 'number';
        this.bypassInput.min = '0';
        this.bypassInput.step = '0.1';
        this.bypassInput.valueAsNumber = 0;
        this.bypassInput.onchange = () => this.updateStats();
        bypassRow.appendChild(bypassLabel);
        bypassRow.appendChild(this.bypassInput);
        inputsDiv.appendChild(bypassRow);

        // Mass Flow Adjustment
        const flowRow = document.createElement('div');
        flowRow.className = 'engine-builder-row';
        const flowLabel = document.createElement('label');
        flowLabel.textContent = localization.translate('Turbo Builder Mass Flow Adjustment');
        this.flowAdjustInput = document.createElement('input');
        this.flowAdjustInput.type = 'number';
        this.flowAdjustInput.min = '-0.5';
        this.flowAdjustInput.max = '0.5';
        this.flowAdjustInput.step = '0.05';
        this.flowAdjustInput.valueAsNumber = 0;
        this.flowAdjustInput.onchange = () => this.updateStats();
        flowRow.appendChild(flowLabel);
        flowRow.appendChild(this.flowAdjustInput);
        inputsDiv.appendChild(flowRow);

        // Afterburner
        const abRow = document.createElement('div');
        abRow.className = 'engine-builder-row checkbox-row';
        const abLabel = document.createElement('label');
        this.afterburnerCheckbox = document.createElement('input');
        this.afterburnerCheckbox.type = 'checkbox';
        this.afterburnerCheckbox.onchange = () => this.updateStats();
        const abText = document.createElement('span');
        abText.textContent = localization.translate('Turbo Builder Afterburner');
        abLabel.appendChild(this.afterburnerCheckbox);
        abLabel.appendChild(abText);
        abRow.appendChild(abLabel);
        inputsDiv.appendChild(abRow);

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

        this.powerDisplay = createStatItem('Turbo Builder Thrust');
        this.massDisplay = createStatItem('Engine Builder Mass');
        this.dragDisplay = createStatItem('Engine Builder Drag');
        this.reliabilityDisplay = createStatItem('Engine Builder Reliability');
        this.fuelDisplay = createStatItem('Engine Builder Fuel Consumption');
        this.costDisplay = createStatItem('Engine Builder Cost');
        this.altitudeDisplay = createStatItem('Engine Builder Altitude');

        container.appendChild(statsGrid);
    }

    private updateTypeChanged(): void {
        const selectedType = this.typeSelect.selectedIndex;
        if (selectedType === 0 || selectedType === 3) {
            this.bypassInput.disabled = true;
        } else {
            this.bypassInput.disabled = false;
        }
        this.updateStats();
    }

    private updateStats(): void {
        const upgrades = [this.afterburnerCheckbox.checked];

        const engineInputs = createTurbineEngine(
            this.nameInput.value,
            this.eraSelect.selectedIndex,
            this.typeSelect.selectedIndex,
            0,
            this.flowAdjustInput.valueAsNumber,
            this.diameterInput.valueAsNumber,
            this.compressionInput.valueAsNumber,
            this.bypassInput.valueAsNumber,
            upgrades
        );

        try {
            const statsJs = wasm.calculateEngineStats(engineInputs);
            this.currentStats = statsJs as EngineStats;
            this.displayStats();
            this.updateDescription();
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
        this.costDisplay.textContent = this.currentStats.stats.cost.toString();
        this.altitudeDisplay.textContent = this.currentStats.altitude.toString();
    }

    private updateDescription(): void {
        const typeIndex = this.typeSelect.selectedIndex;

        const thrust = this.currentStats.es1.toFixed(2);
        const tsfc = this.currentStats.es2.toFixed(2);

        let description = '';

        switch (typeIndex) {
            case 0:
                description = `<b>Engine Parameters:</b><br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;Thrust = ${thrust} kN<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;Fuel Consumption = ${tsfc} g/(kN*s)<br/>
                    <br/>
                    For a real engine, set the era, total engine diameter (not intake) and OPR. Then
                    adjust the mass flow rate until the Thrust is just below the rated takeoff thrust.<br/>
                    <br/>
                    For a fictional engine, it is not suggested to adjust the mass flow rate.<br/>`;
                break;

            case 1:
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

            case 2:
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

            case 3:
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

    public getEngineInputs(): EngineInputs {
        const upgrades = [this.afterburnerCheckbox.checked];

        return createTurbineEngine(
            this.nameInput.value,
            this.eraSelect.selectedIndex,
            this.typeSelect.selectedIndex,
            0,
            this.flowAdjustInput.valueAsNumber,
            this.diameterInput.valueAsNumber,
            this.compressionInput.valueAsNumber,
            this.bypassInput.valueAsNumber,
            upgrades
        );
    }

    public setEngineInputs(inputs: EngineInputs): void {
        if (!('Turbine' in inputs.inputs)) {
            console.error('Invalid engine type for turbine builder');
            return;
        }

        const turbineInputs = (inputs.inputs as any).Turbine;

        this.nameInput.value = inputs.name;
        this.eraSelect.selectedIndex = inputs.era_sel;
        this.flowAdjustInput.valueAsNumber = turbineInputs.flow_adjustment;
        this.diameterInput.valueAsNumber = turbineInputs.diameter;
        this.compressionInput.valueAsNumber = turbineInputs.compression_ratio;
        this.bypassInput.valueAsNumber = turbineInputs.bypass_ratio;
        this.afterburnerCheckbox.checked = turbineInputs.upgrades[0] || false;

        this.updateStats();
    }
}
